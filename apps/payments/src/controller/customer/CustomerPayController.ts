import {AuthenticatedRequest, Body, Controller, Inject, PermitAll, POST, Req, ResponseUtil} from "@sojo-micro/rpc";
import {PayService} from "@/service/PayService";
import {CreateUserPaymentIntentReq, VerifyStripeWebhook} from "@/types/PayTypes";

@Controller({basePath: '/api/payments/customer/pay'})
export class CustomerPayController {

    constructor(@Inject() private payService: PayService) {
    }

    @POST("/create-payment-intent")
    async createPaymentIntent(@Body() req: CreateUserPaymentIntentReq, @Req() auth: AuthenticatedRequest) {
        let paymentIntentResp = await this.payService.createUserPaymentIntent(req, auth.user.id);
        return ResponseUtil.success(paymentIntentResp);
    }

    @POST("/verify-stripe-webhook")
    @PermitAll()
    async verifyStripeWebhook(@Body() req: VerifyStripeWebhook) {
        await this.payService.verifyStripeWebhook(req);
        return ResponseUtil.success();
    }
}