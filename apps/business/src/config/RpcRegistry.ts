import {RpcServiceDefinition} from "@sojo-micro/rpc";

export const RpcRegistry = {
    MERCHANT_USER_SERVICE: {
        module: 'auth',
        name: 'merchant-user-api',
        version: '1.0.0'
    },
    EMAIL_SERVICE: {
        module: 'auth',
        name: 'email-api',
        version: '1.0.0'
    },
} as const;

function getRpcApiToken(rpcServiceDefinition: RpcServiceDefinition) {
    return rpcServiceDefinition.module + "*" + rpcServiceDefinition.name + "*" + rpcServiceDefinition.version;
}

export const MERCHANT_USER_API = getRpcApiToken(RpcRegistry.MERCHANT_USER_SERVICE)
export const EMAIL_API = getRpcApiToken(RpcRegistry.EMAIL_SERVICE)
