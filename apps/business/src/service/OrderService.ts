import {OrderItemResp, OrderReq, OrderResp, OrderSearchReq} from "@/types/OrderType";

/**
 * Order Service
 */
export abstract class OrderService {
    abstract searchList(req: OrderSearchReq, userId: string): Promise<OrderItemResp[]>;

    abstract addOrder(req: OrderReq, userId: string): Promise<OrderResp>;
}