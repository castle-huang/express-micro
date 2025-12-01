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
import {ServiceAddReq, ServiceSearchReq, ServiceUpdateReq} from "@/types/ServiceType";

@Controller({basePath: '/api/biz/service'})
export class ServiceController {
    constructor(@Inject() private serviceService: ServiceService) {
    }

    @GET('/type/list')
    async getTypeList() {
        const data = await this.serviceService.getTypeList();
        return ResponseUtil.success(data);
    }

    @POST("/add")
    async addService(@Body() req: ServiceAddReq, @Req() auth: AuthenticatedRequest) {
        await this.serviceService.addService(req, auth.user.id);
        return ResponseUtil.success();
    }

    @POST("/update")
    async updateService(@Body() req: ServiceUpdateReq, @Req() auth: AuthenticatedRequest) {
        await this.serviceService.updateService(req, auth.user.id);
        return ResponseUtil.success();
    }


    @POST("/search")
    async getList(@Body() req: ServiceSearchReq, @Req() auth: AuthenticatedRequest) {
        const data = await this.serviceService.getList(req, auth.user.id)
        return ResponseUtil.success(data);
    }
}