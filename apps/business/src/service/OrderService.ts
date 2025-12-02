import {OrderAddReq, OrderItemResp, OrderResp, OrderSearchReq, OrderSearchResp} from "@/types/OrderType";

/**
 * Order Service
 */
export abstract class OrderService {
    abstract searchList(req: OrderSearchReq, userId: string): Promise<OrderSearchResp[]>;

    abstract placeOrder(req: OrderAddReq, customerUserId: string): Promise<OrderResp>;
}