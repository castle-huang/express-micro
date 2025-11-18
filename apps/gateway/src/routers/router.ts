import {Application, NextFunction, Request, Response} from 'express';
import {createProxyMiddleware, Options, RequestHandler} from 'http-proxy-middleware';
import {CommonError, CommonErrorEnum, ResponseUtil, routesConfig} from "@sojo-micro/rpc";

// 类型定义
interface RouteConfig {
    name: string;
    prefix: string;
    target: string;
}

export class RouterManager {
    private routes: RouteConfig[];
    private app: Application;
    private proxyMiddlewares: Map<string, RequestHandler>;

    constructor(app: Application) {
        this.app = app;
        this.routes = routesConfig.routers;
        this.proxyMiddlewares = new Map();
        this.validateRoutes();
        this.setupRoutes();
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
        const {prefix, name} = routeConfig;
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
                return this.selectServiceInstance(name).replace("\\\"", "");
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
     * 选择服务实例
     */
    private selectServiceInstance(serviceName: string): string {
        const route = this.routes.find(r => r.name === serviceName);
        const target = route?.target || '';
        return target + route?.prefix;
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