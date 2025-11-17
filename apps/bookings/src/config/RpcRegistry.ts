import {IRpcRegistry} from "@sojo-micro/rpc";

/**
 * 微服务注册配置
 * 统一管理所有微服务的注入令牌和服务信息
 */
export const RpcRegistry: IRpcRegistry = {
    /** 用户服务 */
    USER_SERVICE: {
        module: 'analytics',
        name: 'user-api',
        version: '1.0.0',
    }
} as const;
/** 服务令牌类型，提供类型安全 */
export const USER_API = RpcRegistry.USER_SERVICE.module + "*" + RpcRegistry.USER_SERVICE.name + "*" + RpcRegistry.USER_SERVICE.version;