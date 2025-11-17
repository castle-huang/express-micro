export interface RpcServiceDefinition {
    /** 模块名称 */
    readonly module: string;
    /** 服务名称 */
    readonly name: string;
    /** 版本号 */
    readonly version: string;
}

export type IRpcRegistry = Record<string, RpcServiceDefinition>;