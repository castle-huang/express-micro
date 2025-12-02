import {
    AuthenticatedRequest,
    BaseResponse, Body,
    Controller,
    Form,
    GET,
    Inject,
    Param, POST, PUT,
    Query,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {MerchantUserService} from "../service/MerchantUserService";
import {ProfilesResp, RegisterReq, UpdateMerchantUserReq, UpdatePasswordReq} from "../types/AuthType";
import {CustomerUpdatePasswordReq} from "@/types/AuthCustomerType";


@Controller({basePath: '/api/auth/merchant/user'})
export class MerchantUserController {
    constructor(@Inject() private adminUserService: MerchantUserService) {
    }

    @GET()
    async getMerchantUser(@Req() authReq: AuthenticatedRequest): Promise<BaseResponse<ProfilesResp>>  {
        const result = await this.adminUserService.getMerchantUser(authReq.user.id);
        return ResponseUtil.success(result);
    }

    @PUT()
    async updateMerchantUser(@Req() authReq: AuthenticatedRequest, @Body() req: UpdateMerchantUserReq): Promise<BaseResponse<ProfilesResp>>  {
        req.id = authReq.user.id;
        await this.adminUserService.updateMerchantUser(req);
        return ResponseUtil.success();
    }

    @POST('/update-pwd')
    async updatePassword(@Req() authReq: AuthenticatedRequest, @Body() req: UpdatePasswordReq)  {
        req.id = authReq.user.id;
        await this.adminUserService.updatePassword(req);
        return ResponseUtil.success();
    }
}