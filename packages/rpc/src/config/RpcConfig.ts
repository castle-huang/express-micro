export interface RpcServiceDefinition {
    /** Module name */
    readonly module: string;
    /** Service name */
    readonly name: string;
    /** Version number */
    readonly version: string;
}

export type IRpcRegistry = Record<string, RpcServiceDefinition>;