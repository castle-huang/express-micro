import {RpcServiceDefinition} from "@sojo-micro/rpc";

export const RpcRegistry = {
    BIZ_ORDER_SERVICE: {
        module: 'biz',
        name: 'biz-order-api',
        version: '1.0.0'
    }
} as const;

function getRpcApiToken(rpcServiceDefinition: RpcServiceDefinition) {
    return rpcServiceDefinition.module + "*" + rpcServiceDefinition.name + "*" + rpcServiceDefinition.version;
}

export const BIZ_ORDER_API = getRpcApiToken(RpcRegistry.BIZ_ORDER_SERVICE)
