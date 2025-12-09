import {Inject, RpcMethod, RpcService} from "@sojo-micro/rpc";
import {OrderService} from "@/service/OrderService";
import {OrderRepository} from "@/repository/OrderRepository";

@RpcService({name: "biz-order-api"})
export class BizOrderApi {
    constructor(@Inject() private orderService: OrderService,
                @Inject() private orderRepository: OrderRepository
    ) {
    }

    @RpcMethod()
    async handleOrderPaymentSuccess(orderId: string) {
        await this.orderService.handleOrderPaymentSuccess(orderId);
    }

    @RpcMethod()
    async getOrderById(orderId: string) {
        return await this.orderRepository.getOneById(orderId);
    }
}