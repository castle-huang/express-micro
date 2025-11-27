import {
    AuthenticatedRequest,
    Body,
    Controller,
    DELETE, Form, GET,
    Inject,
    JWTUtils, Param,
    PermitAll,
    POST,
    PUT, Query,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BusinessService} from "@/service/BusinessService";
import {
    BusinessAddReq,
    BusinessDeleteReq,
    BusinessListReq,
    BusinessResp, BusinessPageReq,
    BusinessUpdateReq, BusinessGetReq
} from "@/types/BusinessType";

@Controller({basePath: '/api/biz/customer/business'})
export class CustomerBusinessController {
    constructor(@Inject() private businessService: BusinessService) {
    }

    @POST('/page')
    async page(@Body() req: BusinessPageReq) {
        const result = await this.businessService.getPage(req);
        return ResponseUtil.success(result);
    }

    @GET('/get')
    async get(@Query() req: BusinessGetReq) {
        const result = await this.businessService.getById(req.id);
        return ResponseUtil.success(result);
    }
}