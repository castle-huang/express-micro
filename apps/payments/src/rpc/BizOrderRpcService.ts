import {BizOrder} from "@/types/OrderType";

export abstract class BizOrderRpcService {
    abstract handleOrderPaymentSuccess(orderId: string): Promise<void>;

    abstract getOrderById(orderId: string):Promise<BizOrder>
}