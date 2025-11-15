import {ServiceProxy} from './ServiceProxy';
import {container} from '../di/Container';
import {DiscoveredService} from './RegistryClient';

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
    private currentInstanceIndex: Map<string, number> = new Map();

    /**
     * Creates a new RpcRegistry instance
     * @param proxy - ServiceProxy instance for remote communication
     */
    constructor(private proxy: ServiceProxy) {
    }

    /**
     * Automatically discovers and registers all available services from the remote server
     * @param namespace - Namespace to use for service registration
     * @returns Promise that resolves when discovery is complete
     */
    async autoDiscover(namespace: string): Promise<void> {
        try {
            console.log('Discovering remote services...');
            const discovery = await this.proxy.discoverServices();
            if (discovery.success) {
                discovery.data.services.forEach((service: any) => {
                    this.registerService(namespace, service.name, service.methods);
                });
                console.log(`Discovered ${discovery.data.totalServices} services with ${discovery.data.totalMethods} methods`);
            }
        } catch (error) {
            console.error('Service discovery failed:', error);
        }
    }

    /**
     * Registers a service proxy in the registry and dependency injection container
     * @param namespace - Namespace for the service
     * @param serviceName - Name of the service to register
     * @param methods - Array of method names available on the service
     * @returns The created service proxy instance
     * @template T - The interface type of the service
     */
    registerService<T extends object>(namespace: string, serviceName: string, methods: string[]): T {
        const proxy = this.proxy.createProxy<T>(serviceName);
        this.proxies.set(serviceName, proxy);
        this.serviceDefinitions.set(serviceName, {name: serviceName, methods});
        let serviceToken = ServiceRegistry.getServiceToken(namespace, serviceName);
        container.registerInstance(serviceToken, proxy);
        return proxy;
    }

    /**
     * Generates a unique service token for dependency injection
     * @param namespace - Namespace for the service
     * @param serviceName - Name of the service
     * @returns Unique service token string
     */
    static getServiceToken(namespace: string, serviceName: string): string {
        return `client_${namespace}_${serviceName}`;
    }

    /**
     * Retrieves a registered service proxy by name
     * @param serviceName - Name of the service to retrieve
     * @returns The service proxy instance
     * @throws Error if the service is not found
     * @template T - The interface type of the service
     */
    getService<T extends object>(serviceName: string): T {
        const proxy = this.proxies.get(serviceName);
        if (!proxy) {
            throw new Error(`Service not found: ${serviceName}`);
        }
        return proxy;
    }

    /**
     * Retrieves the service definition for a registered service
     * @param serviceName - Name of the service
     * @returns Service definition or undefined if not found
     */
    getServiceDefinition(serviceName: string): ServiceDefinition | undefined {
        return this.serviceDefinitions.get(serviceName);
    }

    /**
     * Retrieves all registered service definitions
     * @returns Array of all service definitions
     */
    getAllServices(): ServiceDefinition[] {
        return Array.from(this.serviceDefinitions.values());
    }

    /**
     * 从注册中心发现服务并创建代理对象
     * @param discoveredServices - 从注册中心发现的服务列表
     * @returns Promise that resolves when all services are registered
     */
    async discoverAndRegisterFromRegistry(
        discoveredServices: Map<string, DiscoveredService[]>,
    ): Promise<void> {
        try {
            console.log('Discovering services from registry center...');
            // 遍历所有发现的服务
            for (const [serviceName, instances] of discoveredServices) {
                if (instances.length > 0) {
                    // 从第一个实例中获取方法信息（假设同一服务的所有实例方法相同）
                    const firstInstance = instances[0];
                    const methods = firstInstance.metadata?.methods || [];
                    // 为每个服务实例创建代理（这里只创建一个，实际可根据负载均衡策略选择）
                    this.registerServiceFromRegistry(serviceName, methods, instances);
                }
            }
            console.log(`Registered ${discoveredServices.size} services from registry center`);
        } catch (error) {
            console.error('Service discovery from registry failed:', error);
        }
    }

    /**
     * 从注册中心发现更新服务并创建代理对象
     * @param discoveredServices - 从注册中心发现的服务列表
     * @returns Promise that resolves when all services are registered
     */
    async discoverAndUpdateRegisterFromRegistry(discoveredServices: Map<string, DiscoveredService[]>, oldDiscoveredServices: Map<string, DiscoveredService[]>): Promise<void> {
        try {
            // 遍历所有发现的服务
            for (const [serviceName, instances] of discoveredServices) {
                if (instances.length > 0) {
                    // 从第一个实例中获取方法信息（假设同一服务的所有实例方法相同）
                    const firstInstance = instances[0];
                    const methods = firstInstance.metadata?.methods || [];
                    const oldInstances = oldDiscoveredServices.get(serviceName)!;
                    // 为每个服务实例创建代理（这里只创建一个，实际可根据负载均衡策略选择）
                    this.updateServiceFromRegistry(serviceName, methods, instances, oldInstances);
                }
            }
        } catch (error) {
            console.error('Service discovery from registry failed:', error);
        }
    }

    /**
     * 为从注册中心发现的服务创建代理对象
     * @param namespace - 命名空间
     * @param serviceName - 服务名称
     * @param methods - 服务方法列表
     * @param instances - 服务实例列表
     */
    private registerServiceFromRegistry(
        serviceName: string,
        methods: string[],
        instances: DiscoveredService[]
    ): void {
        // 创建服务代理，使用负载均衡策略
        const proxy = this.createLoadBalancedProxy(serviceName, instances);
        this.proxies.set(serviceName, proxy);
        this.serviceDefinitions.set(serviceName, {name: serviceName, methods});
        container.registerInstance(serviceName, proxy);
        console.log(`Registered service proxy for ${serviceName} with ${instances.length} instances`);
    }

    private updateServiceFromRegistry(
        serviceName: string,
        methods: string[],
        instances: DiscoveredService[],
        oldInstances: DiscoveredService[],
    ): boolean {
        const oldDefinition = this.serviceDefinitions.get(serviceName);
        // 检查是否有实际变化
        if (this.hasServiceChanged(oldDefinition, oldInstances, methods, instances)) {
            const proxy = this.createLoadBalancedProxy(serviceName, instances);
            this.proxies.set(serviceName, proxy);
            this.serviceDefinitions.set(serviceName, {name: serviceName, methods});
            container.registerInstance(serviceName, proxy);
            console.log(`Updated service proxy for ${serviceName}: ${instances.length} instances, ${methods.length} methods`);
            return true;
        }
        return false;
    }

    /**
     * 获取当前服务的实例列表
     */
    private getCurrentServiceInstances(serviceName: string): DiscoveredService[] {
        const proxy = this.proxies.get(serviceName);
        if (!proxy || !proxy.getInstances) {
            return [];
        }
        try {
            return proxy.getInstances() || [];
        } catch (error) {
            console.warn(`Failed to get current instances for ${serviceName}:`, error);
            return [];
        }
    }

    /**
     * 检查服务配置是否有变化
     */
    private hasServiceChanged(
        existingDefinition: { name: string; methods: string[] } | undefined,
        existingInstances: DiscoveredService[],
        newMethods: string[],
        newInstances: DiscoveredService[]
    ): boolean {
        // 1. 检查是否是全新的服务
        if (!existingDefinition) {
            return true;
        }
        // 2. 检查方法列表是否有变化
        if (this.haveMethodsChanged(existingDefinition.methods, newMethods)) {
            console.log(`Methods changed for ${existingDefinition.name}`);
            return true;
        }
        // 3. 检查实例列表是否有变化
        if (this.haveInstancesChanged(existingInstances, newInstances)) {
            console.log(`Instances changed for ${existingDefinition.name}`);
            return true;
        }
        return false;
    }

    /**
     * 检查方法列表是否有变化
     */
    private haveMethodsChanged(oldMethods: string[], newMethods: string[]): boolean {
        if (oldMethods.length !== newMethods.length) {
            return true;
        }
        // 排序后比较，确保顺序不影响比较结果
        const sortedOld = [...oldMethods].sort();
        const sortedNew = [...newMethods].sort();
        return !sortedOld.every((method, index) => method === sortedNew[index]);
    }

    /**
     * 检查实例列表是否有变化
     */
    private haveInstancesChanged(oldInstances: DiscoveredService[], newInstances: DiscoveredService[]): boolean {
        if (oldInstances.length !== newInstances.length) {
            return true;
        }
        // 基于实例ID进行比较（假设实例有唯一标识符）
        const oldInstanceIds = new Set(oldInstances.map(instance => this.getInstanceId(instance)));
        const newInstanceIds = new Set(newInstances.map(instance => this.getInstanceId(instance)));
        if (oldInstanceIds.size !== newInstanceIds.size) {
            return true;
        }
        // 检查所有实例ID是否相同
        for (const id of newInstanceIds) {
            if (!oldInstanceIds.has(id)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 获取实例的唯一标识符
     */
    private getInstanceId(instance: DiscoveredService): string {
        return instance.id;
    }

    /**
     * 创建负载均衡代理
     * @param serviceName - 服务名称
     * @param instances - 服务实例列表
     * @returns 代理对象
     */
    private createLoadBalancedProxy(serviceName: string, instances: DiscoveredService[]): any {
        // 使用 ServiceProxy 创建代理，但需要动态设置 baseURL
        return new Proxy({}, {
            get: (target, prop, receiver) => {
                if (typeof prop === 'string') {
                    return async (...args: any[]) => {
                        // 选择一个实例（这里使用简单的轮询策略）
                        const instance = this.selectInstance(instances);
                        if (!instance) {
                            throw new Error(`No available instances for service ${serviceName}`);
                        }
                        // 动态设置 ServiceProxy 的 baseURL
                        const baseUrl = `${instance.protocol}://${instance.address}:${instance.port}`;
                        this.proxy.setBaseUrl(baseUrl);
                        // 调用远程方法
                        return this.proxy.call(serviceName, prop, args);
                    };
                }
                return undefined;
            }
        });
    }

    /**
     * 选择服务实例（轮询策略）
     * @param instances - 服务实例列表
     * @returns 选中的实例
     */
    private selectInstance(instances: DiscoveredService[]): DiscoveredService | null {
        // 过滤出健康的服务实例
        const healthyInstances = instances.filter(instance => instance.status === 'UP');

        if (healthyInstances.length === 0) {
            return null;
        }

        // 轮询策略实现
        if (!this.currentInstanceIndex) {
            this.currentInstanceIndex = new Map<string, number>();
        }

        const serviceName = healthyInstances[0].name;
        let index = this.currentInstanceIndex.get(serviceName) || 0;

        // 确保索引在有效范围内
        if (index >= healthyInstances.length) {
            index = 0;
        }
        const selectedInstance = healthyInstances[index];
        // 更新索引为下一个实例
        this.currentInstanceIndex.set(serviceName, (index + 1) % healthyInstances.length);

        return selectedInstance;
    }
}