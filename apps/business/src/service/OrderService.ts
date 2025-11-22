import {OrderItemResp, OrderSearchReq} from "@/types/OrderType";

/**
 * Order Service
 */
export abstract class OrderService {
    abstract searchList(req: OrderSearchReq, userId: string): Promise<OrderItemResp[]>;
}