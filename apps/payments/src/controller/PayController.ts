import {
    AuthenticatedRequest,
    Body,
    Controller,
    GET,
    Inject,
    POST,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {PayService} from "@/service/PayService";
import {
    CreateAccountLinkReq,
    CreateLoginLinkReq,
    CreateStripeAccountReq
} from "@/types/PayTypes";

@Controller({basePath: '/api/payments/pay'})
export class PayController {
    constructor(@Inject() private payService: PayService) {
    }

    @POST("/create-stripe-account")
    async createStripeAccount(@Body() req: CreateStripeAccountReq, @Req() auth: AuthenticatedRequest) {
        const stripeAccountResp = await this.payService.createStripeAccount(req, auth.user.merchantId);
        return ResponseUtil.success(stripeAccountResp);
    }

    @POST("/create-account-link")
    async createAccountLink(@Body() req: CreateAccountLinkReq, @Req() auth: AuthenticatedRequest) {
        const createAccountLinkResp = await this.payService.createAccountLink(req, auth.user.merchantId);
        return ResponseUtil.success(createAccountLinkResp);
    }

    @GET("/get-stripe-account-status")
    async getStripeAccountStatus(@Req() auth: AuthenticatedRequest) {
        const stripeAccountResp = await this.payService.getStripeAccountStatus(auth.user.merchantId);
        return ResponseUtil.success(stripeAccountResp);
    }

    @POST("/create-login-link")
    async createLoginLink(@Body() req: CreateLoginLinkReq, @Req() auth: AuthenticatedRequest) {
        const createLoginLinkResp = await this.payService.createLoginLink(req, auth.user.merchantId);
        return ResponseUtil.success(createLoginLinkResp);
    }
}