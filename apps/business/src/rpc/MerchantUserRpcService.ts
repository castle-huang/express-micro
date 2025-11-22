export abstract class MerchantUserRpcService {
    abstract getMerchantIdByUserId(userId: string): Promise<string>;
}