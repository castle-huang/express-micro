import {OrderAddReq, OrderItemResp, OrderPageResp, OrderResp, OrderSearchReq, OrderSearchResp} from "@/types/OrderType";

/**
 * Order Service
 */
export abstract class OrderService {
    abstract searchList(req: OrderSearchReq, userId: string): Promise<OrderPageResp>;

    abstract placeOrder(req: OrderAddReq, customerUserId: string): Promise<OrderResp>;

    abstract handleOrderPaymentSuccess(orderId: string): Promise<void>;
}