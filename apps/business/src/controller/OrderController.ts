import {
    AuthenticatedRequest,
    Body,
    Controller,
    Inject,
    POST,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {OrderService} from "@/service/OrderService";
import {OrderSearchReq} from "@/types/OrderType";

@Controller({basePath: '/api/biz/order'})
export class OrderController {
    constructor(@Inject() private orderService: OrderService) {
    }

    @POST('/search')
    async searchList(@Body() req: OrderSearchReq, @Req() auth: AuthenticatedRequest) {
        const list = await this.orderService.searchList(req, auth.user.id);
        return ResponseUtil.success(list);
    }
}