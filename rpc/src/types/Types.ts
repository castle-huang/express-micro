import {ServiceScope} from '../di/Container';

export interface RpcRequest {
    service: string;
    method: string;
    args: any[];
    metadata: {
        requestId: string;
        timestamp: number;
        caller?: string;
    };
}

export interface RpcResponse {
    success: boolean;
    data?: any;
    error?: {
        message: string;
        code?: string;
        stack?: string;
    };
    metadata: {
        requestId: string;
        timestamp: number;
        duration: number;
    };
}

// Store Controller metadata
export interface ControllerMetadata {
    basePath?: string;
    name?: string;
    version?: string;
    scope: ServiceScope;
}

// Store Service metadata
export interface ServiceMetadata {
    name?: string;
    version?: string;
    scope: ServiceScope;
}

// Store Component metadata
export interface ComponentMetadata {
    name?: string;
    version?: string;
    scope: ServiceScope;
}

// Store route method metadata
export interface RouteMethodMetadata {
    method: string;
    path: string;
    name?: string;
    description?: string;
}
