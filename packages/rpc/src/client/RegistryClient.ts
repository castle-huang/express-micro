import axios, {AxiosInstance} from 'axios';

export interface RegistryServiceInfo {
    name: string;
    version: string;
    address: string;
    port: number;
    protocol: string;
    metadata?: Record<string, any>;
}

export interface DiscoveredService {
    id: string;
    name: string;
    version: string;
    address: string;
    port: number;
    protocol: string;
    metadata?: Record<string, any>;
    lastHeartbeat: string;
    status: string;
}

export class RegistryClient {
    private client: AxiosInstance;
    private serviceId: string | null = null;
    private heartbeatInterval: NodeJS.Timeout | null = null;

    constructor(registryUrl: string) {
        this.client = axios.create({
            baseURL: registryUrl,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * 注册服务到注册中心
     */
    async registerService(serviceInfo: RegistryServiceInfo): Promise<boolean> {
        try {
            const response = await this.client.post('/api/registry/register', serviceInfo);
            if (response.data.success) {
                // 保存服务ID用于心跳
                this.serviceId = `${serviceInfo.name}:${serviceInfo.version}:${serviceInfo.address}:${serviceInfo.port}`;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to register service:', error);
            return false;
        }
    }

    /**
     * 发现服务
     */
    async discoverServices(serviceName?: string): Promise<DiscoveredService[]> {
        try {
            let response;
            if (serviceName) {
                // 发现特定服务
                response = await this.client.get(`/api/registry/services/${encodeURIComponent(serviceName)}`);
            } else {
                // 发现所有服务
                response = await this.client.get('/api/registry/services');
            }

            if (response.data.success) {
                return response.data.data;
            }
            return [];
        } catch (error) {
            console.error('Failed to discover services:', error);
            return [];
        }
    }

    /**
     * 开始发送心跳包
     */
    startHeartbeat(interval: number = 10000): void {
        if (!this.serviceId) {
            console.warn('Service not registered, cannot start heartbeat');
            return;
        }

        // 立即发送一次心跳
        this.sendHeartbeat();

        // 设置定期心跳
        this.heartbeatInterval = setInterval(() => {
            this.sendHeartbeat();
        }, interval);
    }

    /**
     * 发送心跳包
     */
    private async sendHeartbeat(): Promise<void> {
        if (!this.serviceId) return;
        try {
            await this.client.post(`/api/registry/heartbeat/${encodeURIComponent(this.serviceId)}`);
        } catch (error) {
            console.error('Failed to send heartbeat:', error);
        }
    }

    /**
     * 停止心跳
     */
    stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }
}
