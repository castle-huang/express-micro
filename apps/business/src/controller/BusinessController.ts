import {AuthenticatedRequest, Body, Controller, GET, Inject, POST, Req, ResponseUtil} from "@sojo-micro/rpc";
import {BusinessService} from "@/service/BusinessService";
import {BusinessAddReq, BusinessDeleteReq, BusinessListReq, BusinessUpdateReq,} from "@/types/BusinessType";

@Controller({basePath: '/api/biz/business'})
export class BusinessController {
    constructor(@Inject() private businessService: BusinessService) {
    }

    @POST("/add")
    async add(@Req() auth: AuthenticatedRequest,
              @Body() req: BusinessAddReq) {
        const bizReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        await this.businessService.addBusiness(bizReq, auth.user.id);
        return ResponseUtil.success();
    }

    /**
     * Update business
     */
    @POST("/update")
    async update(@Req() auth: AuthenticatedRequest, @Body() req: BusinessUpdateReq) {
        const bizReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        await this.businessService.updateBusiness(bizReq, auth.user.id);
        return ResponseUtil.success();
    }


    /**
     * BizBusiness list
     */
    @GET('/list')
    async list(@Req() auth: AuthenticatedRequest, @Body() req: BusinessListReq) {
        const bizReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        const result = await this.businessService.getList(bizReq, auth.user.id);
        return ResponseUtil.success(result);
    }

    /**
     * Delete business
     */
    @POST("/delete")
    async delete(@Req() auth: AuthenticatedRequest, @Body() req: BusinessDeleteReq) {
        const bizReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        await this.businessService.deleteBusiness(bizReq, auth.user.id);
        return ResponseUtil.success();
    }

    @POST("/dropdown")
    async getDropdownList(@Req() auth: AuthenticatedRequest) {
        const data = await this.businessService.getDropdownList(auth.user.merchantId)
        return ResponseUtil.success(data);
    }
}