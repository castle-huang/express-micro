import {
    CreateAccountLinkReq,
    CreateAccountLinkResp,
    CreateLoginLinkReq, CreateLoginLinkResp,
    CreateStripeAccountReq, CreateUserPaymentIntentReq, PaymentIntentResp,
    StripeAccountResp, VerifyStripeWebhook
} from "@/types/PayTypes";

/**
 * payService
 */
export abstract class PayService {
    abstract createStripeAccount(req: CreateStripeAccountReq, merchantId: string): Promise<StripeAccountResp>;

    abstract createAccountLink(req: CreateAccountLinkReq, merchantId: string): Promise<CreateAccountLinkResp>

    abstract getStripeAccountStatus(merchantId: string): Promise<StripeAccountResp>;

    abstract createLoginLink(req: CreateLoginLinkReq, merchantId: string): Promise<CreateLoginLinkResp>;

    abstract createUserPaymentIntent(req: CreateUserPaymentIntentReq, userId: string): Promise<PaymentIntentResp>;

    abstract verifyStripeWebhook(req: VerifyStripeWebhook): Promise<void>;
}