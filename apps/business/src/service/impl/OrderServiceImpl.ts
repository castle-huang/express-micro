import {camelToSnake, CommonError, CommonErrorEnum, Inject, Service} from "@sojo-micro/rpc";
import {OrderService} from "@/service/OrderService";
import {OrderSearchReq, OrderItemResp} from "@/types/OrderType";
import {OrderRepository} from "@/repository/OrderRepository";
import {MERCHANT_USER_API} from "@/config/RpcRegistry";
import {MerchantUserRpcService} from "@/rpc/MerchantUserRpcService";

@Service()
export class OrderServiceImpl implements OrderService {
    constructor(@Inject(MERCHANT_USER_API) private merchantUserRpcService: MerchantUserRpcService,
                @Inject() private orderRepository: OrderRepository) {
    }

    async searchList(req: OrderSearchReq, userId: string): Promise<OrderItemResp[]> {
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const list = await this.orderRepository.searchList(req, merchantId);
        return list.map(item => {
            return item;
        });
    }

}