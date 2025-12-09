export abstract class MerchantUserRpcService {
    abstract getMerchantIdByUserId(userId: string): Promise<string>;

    abstract getEmailByMerchantId(merchantId: string): Promise<string>
}