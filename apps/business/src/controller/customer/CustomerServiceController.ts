import {
    AuthenticatedRequest,
    Body,
    Controller,
    GET,
    Inject,
    POST, Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {ServiceService} from "@/service/ServiceService";
import {ServiceAddReq, ServicePageReq, ServiceSearchReq} from "@/types/ServiceType";

@Controller({basePath: '/api/biz/customer/service'})
export class CustomerServiceController {
    constructor(@Inject() private serviceService: ServiceService) {
    }

    @POST("/page")
    async pages(@Body() req: ServicePageReq) {
        const result = await this.serviceService.page(req);
        return ResponseUtil.success(result);
    }

}