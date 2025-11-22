import {Inject, RpcMethod, RpcService} from "@sojo-micro/rpc";
import {MerchantUserRepository} from "@/repository/MerchantUserRepository";

@RpcService({name: "merchant-user-api"})
export class MerchantUserApi {
    constructor(@Inject() private merchantUserRepository: MerchantUserRepository) {
    }

    @RpcMethod()
    async getMerchantIdByUserId(userId: string): Promise<string> {
        const merchantUser = await this.merchantUserRepository.findById(userId);
        return merchantUser?.merchantId || "";
    }
}