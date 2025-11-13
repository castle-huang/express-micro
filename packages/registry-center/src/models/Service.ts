export interface ServiceInstance {
    id: string;
    name: string;
    version: string;
    address: string;
    port: number;
    protocol: string;
    metadata?: Record<string, any>;
    lastHeartbeat: Date;
    status: 'UP' | 'DOWN' | 'OUT_OF_SERVICE';
}

export interface ServiceRegistration {
    name: string;
    version: string;
    address: string;
    port: number;
    protocol?: string;
    metadata?: Record<string, any>;
}

export interface ServiceDiscovery {
    name: string;
    version?: string;
}