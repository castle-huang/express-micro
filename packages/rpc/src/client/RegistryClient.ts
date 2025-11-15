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
            return !!response.data.success;
        } catch (error) {
            console.error('Failed to register service:', error);
            return false;
        }
    }

    /**
     * 发送心跳包
     */
    async sendHeartbeat(serviceInfo: RegistryServiceInfo): Promise<boolean> {
        try {
            const serviceId = `${serviceInfo.name}:${serviceInfo.version}:${serviceInfo.address}:${serviceInfo.port}`;
            const response = await this.client.post(`/api/registry/heartbeat/${encodeURIComponent(serviceId)}`);
            return !!response.data.success;
        } catch (error) {
            console.error('Failed to send heartbeat:', error);
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
}
