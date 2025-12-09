import {
    AuthenticatedRequest,
    BaseResponse,
    Body,
    Controller,
    GET,
    Inject, PermitAll, POST,
    PUT,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {ProfilesResp} from "../types/AuthType";
import {CustomerUserService} from "@/service/CustomerUserService";
import {
    CustomerResetPasswordReq, CustomerSendResetPwdEmailReq,
    CustomerUpdatePasswordReq, CustomerVerifyCodeReq,
    GetCustomerResp,
    UpdateCustomerUserReq
} from "@/types/AuthCustomerType";


@Controller({basePath: '/api/auth/customer/user'})
export class CustomerUserController {
    constructor(@Inject() private customerUserService: CustomerUserService) {
    }

    @GET()
    async getCustomerUser(@Req() authReq: AuthenticatedRequest): Promise<BaseResponse<ProfilesResp>>  {
        const result = await this.customerUserService.getCustomerUser(authReq.user.id);
        return ResponseUtil.success(result);
    }

    @PUT()
    async updateCustomerUser(@Req() authReq: AuthenticatedRequest, @Body() req: UpdateCustomerUserReq): Promise<BaseResponse<GetCustomerResp>>  {
        req.id = authReq.user.id;
        await this.customerUserService.updateCustomerUser(req);
        return ResponseUtil.success();
    }

    @POST('/update-pwd')
    async updatePassword(@Req() authReq: AuthenticatedRequest, @Body() req: CustomerUpdatePasswordReq)  {
        req.id = authReq.user.id;
        await this.customerUserService.updatePassword(req);
        return ResponseUtil.success();
    }

    @POST('/send-reset-pwd-email')
    @PermitAll()
    async sendResetPwdEmail(@Body() req: CustomerSendResetPwdEmailReq)  {
        const success = await this.customerUserService.sendResetPwdEmail(req.email);
        return ResponseUtil.success(success);
    }

    @POST('/verify-reset-pwd-code')
    @PermitAll()
    async verifyResetPwdCode(@Body() req: CustomerVerifyCodeReq)  {
        const success = await this.customerUserService.verifyResetPwdCode(req);
        return ResponseUtil.success(success);
    }

    @POST('/reset-pwd')
    @PermitAll()
    async resetPwd(@Body() req: CustomerResetPasswordReq)  {
        const success = await this.customerUserService.resetPwd(req);
        return ResponseUtil.success(success);
    }
}