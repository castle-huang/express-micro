import {ServiceInstance, ServiceRegistration, ServiceDiscovery} from '../models/Service';

export class RegistryService {
    private services: Map<string, ServiceInstance> = new Map();
    private heartbeatInterval: number = 10000; // 30 seconds
    private cleanupInterval: NodeJS.Timeout;

    constructor() {
        // 启动心跳检查定时任务
        this.cleanupInterval = setInterval(() => {
            this.checkHeartbeats();
        }, this.heartbeatInterval);
    }

    /**
     * 注册服务实例
     */
    register(registration: ServiceRegistration): ServiceInstance {
        const serviceId = this.generateServiceId(registration);

        const serviceInstance: ServiceInstance = {
            id: serviceId,
            name: registration.name,
            version: registration.version,
            address: registration.address,
            port: registration.port,
            protocol: registration.protocol || 'http',
            metadata: registration.metadata || {},
            lastHeartbeat: new Date(),
            status: 'UP'
        };

        this.services.set(serviceId, serviceInstance);
        console.log(`Service registered: ${serviceId}`);

        return serviceInstance;
    }

    /**
     * 注销服务实例
     */
    unregister(serviceId: string): boolean {
        const existed = this.services.delete(serviceId);
        if (existed) {
            console.log(`Service unregistered: ${serviceId}`);
        }
        return existed;
    }

    /**
     * 更新心跳
     */
    heartbeat(serviceId: string): boolean {
        const service = this.services.get(serviceId);
        if (service) {
            service.lastHeartbeat = new Date();
            service.status = 'UP';
            console.log(`Heartbeat received from: ${serviceId}`);
            return true;
        }
        return false;
    }

    /**
     * 发现服务
     */
    discover(discovery: ServiceDiscovery): ServiceInstance[] {
        let instances = Array.from(this.services.values())
            .filter(instance => instance.name === discovery.name && instance.status === 'UP');

        if (discovery.version) {
            instances = instances.filter(instance => instance.version === discovery.version);
        }

        return instances;
    }

    /**
     * 获取所有服务实例
     */
    getAllServices(): ServiceInstance[] {
        return Array.from(this.services.values());
    }

    /**
     * 获取特定服务的所有实例
     */
    getServiceInstances(serviceName: string): ServiceInstance[] {
        return Array.from(this.services.values())
            .filter(instance => instance.name === serviceName);
    }

    /**
     * 检查服务心跳
     */
    private checkHeartbeats(): void {
        const now = new Date();
        const timeout = this.heartbeatInterval * 3;
        this.services.forEach((service, serviceId) => {
            const timeSinceLastHeartbeat = now.getTime() - service.lastHeartbeat.getTime();

            if (timeSinceLastHeartbeat > timeout) {
                service.status = 'DOWN';
                console.log(`Service marked as DOWN: ${serviceId}`);
            }
        });
    }

    /**
     * 生成服务ID
     */
    private generateServiceId(registration: ServiceRegistration): string {
        return `${registration.name}:${registration.version}:${registration.address}:${registration.port}`;
    }

    /**
     * 清理过期服务
     */
    cleanupExpiredServices(): number {
        const now = new Date();
        const expirationTime = this.heartbeatInterval * 5; // 5倍心跳间隔作为过期时间
        let cleanedCount = 0;

        this.services.forEach((service, serviceId) => {
            const timeSinceLastHeartbeat = now.getTime() - service.lastHeartbeat.getTime();

            if (timeSinceLastHeartbeat > expirationTime) {
                this.services.delete(serviceId);
                cleanedCount++;
                console.log(`Expired service cleaned: ${serviceId}`);
            }
        });

        return cleanedCount;
    }

    /**
     * 停止服务
     */
    stop(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}