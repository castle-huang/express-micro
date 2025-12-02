import {
    AuthenticatedRequest,
    Body,
    Controller,
    Inject,
    POST,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {OrderAddReq} from "@/types/OrderType";
import {OrderService} from "@/service/OrderService";

@Controller({basePath: '/api/biz/customer/order'})
export class CustomerOrderController {
    constructor(@Inject() private orderService: OrderService) {
    }

    @POST('/place-order')
    async placeOrder(@Req() auth: AuthenticatedRequest, @Body() req: OrderAddReq) {
        const result = await this.orderService.placeOrder(req, auth.user.id);
        return ResponseUtil.success(result);
    }
}