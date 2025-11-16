import {Application, NextFunction, Request, Response} from 'express';
import {createProxyMiddleware, Options, RequestHandler} from 'http-proxy-middleware';
import {routesConfig} from "../config/routesConfig";
import {CommonError, CommonErrorEnum, HttpTransport, ResponseUtil} from "@sojo-micro/rpc";
import {DiscoveredService} from "@sojo-micro/rpc/dist/client/RegistryClient";

// 类型定义
interface RouteConfig {
    name: string;
    prefix: string;
    target: string;
}

export class RouterManager {
    private routes: RouteConfig[];
    private app: Application;
    private httpTransport: HttpTransport;
    private proxyMiddlewares: Map<string, RequestHandler>;
    private serviceMap: Map<string, string[]>;
    private currentIndexes: Map<string, number>;
    private updateServiceInstanceInterval: NodeJS.Timeout | null = null;

    constructor(httpTransport: HttpTransport) {
        this.app = httpTransport.getApp();
        this.httpTransport = httpTransport;
        this.routes = routesConfig.routers;
        this.proxyMiddlewares = new Map();
        this.currentIndexes = new Map();
        this.serviceMap = new Map();
        this.startUpdateServiceInterval();
        this.validateRoutes();
        this.setupRoutes();
    }

    /**
     * 更新服务实例任务列表
     */
    private updateServiceTask(): void {
        try {

            for (const route of this.routes) {
                const serverName = route.name;
                const targetUrls = new Set<string>();
                const discoveredServices = this.httpTransport.getDiscoveredServices();
                for (const [discoverName, serviceInstances] of discoveredServices) {
                    if (discoverName.split("*")[0] != serverName) {
                        continue;
                    }
                    if (serviceInstances.length == 0) {
                        continue;
                    }
                    for (const serviceInstance of serviceInstances) {
                        if (serviceInstance.status == "UP" && serviceInstance.metadata?.type == "controller") {
                            const targetUrl = serviceInstance.protocol + "://" + serviceInstance.address + ":" + serviceInstance.port;
                            targetUrls.add(targetUrl);
                        }
                    }
                }
                this.serviceMap.set(serverName, Array.from(targetUrls));
            }
        } catch (error) {
            console.error('Error updating service instances:', error);
        }
    }

    /**
     * 开始更新任务
     */
    startUpdateServiceInterval(interval: number = 3000): void {
        this.updateServiceTask();
        this.updateServiceInstanceInterval = setInterval(() => {
            this.updateServiceTask();
        }, interval);
    }

    /**
     * 验证路由配置
     */
    private validateRoutes(): void {
        const prefixes = new Set<string>();

        this.routes.forEach((route, index) => {
            if (!route.prefix || !route.target) {
                throw new Error(`Route at index ${index} is missing required fields (prefix or target)`);
            }

            if (prefixes.has(route.prefix)) {
                throw new Error(`Duplicate route prefix: ${route.prefix}`);
            }
            prefixes.add(route.prefix);

            if (!this.serviceMap.has(route.target)) {
                console.warn(`No service URL configured for target: ${route.target}, using default`);
            }
        });
    }

    /**
     * 设置所有路由
     */
    private setupRoutes(): void {
        this.routes.forEach(route => {
            this.registerRoute(route);
        });
        this.app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
            if (process.env.NODE_ENV === 'development') {
                console.error('Global Error catch:', {
                    message: error.message,
                    stack: error.stack,
                    path: req.path,
                    method: req.method,
                    ip: req.ip,
                    timestamp: new Date().toISOString()
                });
            }
            if (error instanceof CommonError) {
                if (typeof error.code === 'string') {
                    res.json(ResponseUtil.commonError(error.code, error.message));
                } else {
                    res.json(ResponseUtil.commonError(error.code.code, error.code.msg));
                }
            } else {
                res.json(ResponseUtil.error(CommonErrorEnum.SYSTEM_EXCEPTION));
            }
        });
    }

    /**
     * 注册单个路由
     */
    private registerRoute(routeConfig: RouteConfig): void {
        const {prefix, target, name} = routeConfig;

        try {
            const proxyMiddleware = this.createProxyMiddleware(routeConfig);
            this.proxyMiddlewares.set(prefix, proxyMiddleware);
            this.app.use(prefix, proxyMiddleware);
            console.log(`✅ Registered route: ${prefix.padEnd(20)} -> ${target.padEnd(12)} (${name})`);
        } catch (error) {
            console.error(`❌ Failed to register route ${prefix}:`, error);
            throw error;
        }
    }

    /**
     * 创建代理中间件
     */
    private createProxyMiddleware(routeConfig: RouteConfig): RequestHandler {
        console.log("createProxyMiddleware")
        const {prefix, target} = routeConfig;
        const options: Options = {
            target: '',
            changeOrigin: true,
            secure: false,
            timeout: 30000,
            proxyTimeout: 30000,
            pathRewrite: {
                [`^${prefix}`]: '',
            },
            router: (req: any): string => {
                return this.selectServiceInstance(target);
            },
            on: {
                proxyReq: (proxyReq: any, req: Request, res: Response) => {
                    this.logRequest(routeConfig, req);
                    this.addProxyHeaders(proxyReq, req);
                },
                error: (err: Error, req: Request, res: Response) => {
                    this.handleProxyError(err, routeConfig, req, res);
                },
                proxyRes: (proxyRes: any, req: Request, res: Response) => {
                    this.logResponse(routeConfig, req, proxyRes);
                }
            } as any // 使用类型断言解决类型不兼容问题
        };

        return createProxyMiddleware(options);
    }

    /**
     * 选择服务实例（轮询负载均衡）
     */
    private selectServiceInstance(serviceName: string): string {
        let healthyInstances = this.serviceMap.get(serviceName);
        if (!healthyInstances) {
            throw new Error("不可使用");
        }
        let index = this.currentIndexes.get(serviceName) || 0
        // 确保索引在有效范围内
        if (index >= healthyInstances.length) {
            index = 0;
        }
        const selectedInstance = healthyInstances[index];
        if (!selectedInstance) {
            throw new Error("不可使用");
        }
        this.currentIndexes.set(serviceName, (index + 1) % healthyInstances.length);
        const route = this.routes.find(r => r.name === serviceName);
        const url = selectedInstance + route?.prefix;
        return url;
    }

    /**
     * 记录请求日志
     */
    private logRequest(routeConfig: RouteConfig, req: Request): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${routeConfig.name}] ${req.method} ${req.originalUrl} -> ${routeConfig.target}`);
    }

    /**
     * 记录响应日志
     */
    private logResponse(routeConfig: RouteConfig, req: Request, proxyRes: any): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${routeConfig.name}] ${req.method} ${req.originalUrl} <- ${proxyRes.statusCode}`);
    }

    /**
     * 添加代理头部
     */
    private addProxyHeaders(proxyReq: any, req: Request): void {
        proxyReq.setHeader('x-forwarded-for', req.ip || req.socket.remoteAddress);
        proxyReq.setHeader('x-forwarded-proto', req.protocol);
        proxyReq.setHeader('x-forwarded-host', req.get('host') || '');
        proxyReq.setHeader('x-real-ip', req.ip || req.socket.remoteAddress);
    }

    /**
     * 处理代理错误
     */
    private handleProxyError(err: Error, routeConfig: RouteConfig, req: Request, res: Response): void {
        console.error(`[Proxy Error] ${routeConfig.name}:`, {
            error: err.message,
            url: req.originalUrl,
            method: req.method,
            target: routeConfig.target
        });

        if (err.message.includes('ECONNREFUSED')) {
            res.status(503).json({
                error: 'Service Unavailable',
                message: `Service ${routeConfig.target} is not available`,
                service: routeConfig.target
            });
        } else if (err.message.includes('ETIMEDOUT')) {
            res.status(504).json({
                error: 'Gateway Timeout',
                message: `Service ${routeConfig.target} did not respond in time`
            });
        } else {
            res.status(502).json({
                error: 'Bad Gateway',
                message: `Error communicating with service ${routeConfig.target}`
            });
        }
    }
}

export default RouterManager;