import {ServiceProxy} from './ServiceProxy';
import {container} from '../di/Container';
import {RpcServiceDefinition} from "../config/RpcConfig";
import {routesConfig} from "../config/routesConfig";

/**
 * Definition interface for a remote service
 */
export interface ServiceDefinition {
    name: string;
    methods: string[];
}

/**
 * RpcRegistry manages the registration and discovery of remote services
 *
 * This class provides:
 * - Automatic service discovery from remote endpoints
 * - Service proxy registration and management
 * - Dependency injection container integration
 * - Service definition tracking and retrieval
 */
export class ServiceRegistry {
    private proxies: Map<string, any> = new Map();
    private serviceDefinitions: Map<string, ServiceDefinition> = new Map();

    /**
     * Creates a new RpcRegistry instance
     * @param proxy - ServiceProxy instance for remote communication
     */
    constructor(private proxy: ServiceProxy) {
    }

    /**
     * Registers an RPC service with the registry
     *
     * This method:
     * - Finds the corresponding route configuration for the service module
     * - Constructs a unique service name using module, service name, and version
     * - Creates a load-balanced proxy for the service
     * - Registers the proxy in the internal maps and DI container
     *
     * @param rpcServiceDefinition - The RPC service definition containing module, name, and version
     */
    registerRpcService(
        rpcServiceDefinition: RpcServiceDefinition
    ): void {
        const route = routesConfig.routers.find(r => r.name === rpcServiceDefinition.module);
        const serviceName = rpcServiceDefinition.module + "*" + rpcServiceDefinition.name + "*" + rpcServiceDefinition.version;
        const proxy = this.createLoadBalancedProxy(serviceName, route?.target || '');
        this.proxies.set(serviceName, proxy);
        const methods: string[] = [];
        this.serviceDefinitions.set(serviceName, {name: serviceName, methods});
        container.registerInstance(serviceName, proxy);
    }

    /**
     * Create a load-balanced proxy
     * @param serviceName - The name of the service
     * @param targetUrl - The target URL for the service
     * @returns The proxy object
     */

    private createLoadBalancedProxy(serviceName: string, targetUrl: string): any {
        return new Proxy({}, {
            get: (target, prop, receiver) => {
                if (typeof prop === 'string') {
                    return async (...args: any[]) => {
                        this.proxy.setBaseUrl(targetUrl);
                        // 调用远程方法
                        return this.proxy.call(serviceName, prop, args);
                    };
                }
                return undefined;
            }
        });
    }
}