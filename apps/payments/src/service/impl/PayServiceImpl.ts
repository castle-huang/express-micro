import {
    CreateAccountLinkReq, CreateAccountLinkResp, CreateLoginLinkReq, CreateLoginLinkResp,
    CreateStripeAccountReq,
    CreateUserPaymentIntentReq, PaymentIntentReq,
    PaymentIntentResp,
    StripeAccountResp,
    VerifyStripeWebhook
} from "@/types/PayTypes";
import {CommonError, CommonErrorEnum, Inject, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {StripeConnectService} from "@/component/StripeConnectService";
import {AccountLinkParams, CreateAccountParams} from "@/types/ConnectTypes";
import {PayStripeAccountRepository} from "@/repository/PayStripeAccountRepository";
import {PayService} from "@/service/PayService";
import {getStripeConnectConfig} from "@/config/StripeConnectConfig";
import Stripe from "stripe";
import {BizOrderRpcService} from "@/rpc/BizOrderRpcService";
import {BIZ_ORDER_API} from "@/config/RpcRegistry";

@Service()
export class PayServiceImpl implements PayService {
    constructor(@Inject() private stripeConnectService: StripeConnectService,
                @Inject() private payStipeAccountRepository: PayStripeAccountRepository,
                @Inject(BIZ_ORDER_API) private bizOrderRpcService: BizOrderRpcService
    ) {
    }

    async createStripeAccount(req: CreateStripeAccountReq, merchantId: string): Promise<StripeAccountResp> {
        const stripeAccountResp = await this.getStripeAccountStatus(merchantId)
        if (stripeAccountResp.id) {
            return stripeAccountResp;
        }
        if (!req.country || !req.email || !req.businessType) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: country, email,businessType");
        }
        const accountParams: CreateAccountParams = {
            type: 'custom',
            country: req.country,
            email: req.email,
            businessType: req.businessType
        }
        try {
            const account = await this.stripeConnectService.createAccount(accountParams);
            const id = SnowflakeUtil.generateId();
            await this.payStipeAccountRepository.insert({
                id: SnowflakeUtil.generateId(),
                type: accountParams.type,
                country: accountParams.country,
                email: accountParams.email,
                businessType: accountParams.businessType,
                merchantId,
                account: account.id,
                status: false,
                deleted: false,
                updateTime: new Date().getTime(),
                createTime: new Date().getTime()
            });
            return {status: false, id: id};
        } catch (error) {
            console.error('Create account error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    async createAccountLink(req: CreateAccountLinkReq, merchantId: string): Promise<CreateAccountLinkResp> {
        if (!req.id) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: id");
        }
        const stripeAccount = await this.payStipeAccountRepository.getOneById(req.id);
        if (!stripeAccount) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND, "stripe account is not exist");
        }
        if (stripeAccount && stripeAccount.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const stripeAccountResp = await this.getStripeAccountStatus(merchantId);
        if (!stripeAccountResp) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "stripe account is not exist");
        }
        if (stripeAccountResp.status) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "stripe account is active");
        }
        const accountLinkParams: AccountLinkParams = {
            account: stripeAccount.account ?? '',
            refresh_url: req.refreshUrl,
            return_url: req.returnUrl,
            type: 'account_onboarding'
        };
        try {
            const accountLink = await this.stripeConnectService.createAccountLink(accountLinkParams)
            return {url: accountLink.url};
        } catch (error) {
            console.error('Create account link error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    async createLoginLink(req: CreateLoginLinkReq, merchantId: string): Promise<CreateLoginLinkResp> {
        if (!req.id) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: id");
        }
        const stripeAccount = await this.payStipeAccountRepository.getOneById(req.id);
        if (!stripeAccount) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "stripe account is not exist");
        }
        if (stripeAccount.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        if (!stripeAccount.status) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "stripe account is not active");
        }
        try {
            const loginLink = await this.stripeConnectService.createLoginLink({
                account: stripeAccount.account ?? '',
            });
            return {url: loginLink.url};
        } catch (error) {
            console.error('Create login link error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    async getStripeAccountStatus(merchantId: string): Promise<StripeAccountResp> {
        const payStripeAccount = await this.payStipeAccountRepository.getOneByMerchantId(merchantId);
        if (!payStripeAccount) {
            return {status: false, id: ''};
        }
        const accountId = payStripeAccount.account
        if (payStripeAccount.status) {
            return {status: true, id: payStripeAccount.id};
        }
        try {
            const isReadyForPayments = await this.stripeConnectService.isAccountReadyForPayments(accountId ?? '');
            if (isReadyForPayments) {
                await this.payStipeAccountRepository.update({
                    id: payStripeAccount.id,
                    status: true,
                    updateTime: new Date().getTime(),
                    activeTime: new Date().getTime()
                });
            }
            return {
                status: isReadyForPayments,
                id: payStripeAccount.id
            };
        } catch (error) {
            console.error('Retrieve stripe account error:', error);
            throw new CommonError(
                CommonErrorEnum.SYSTEM_EXCEPTION,
                error instanceof Error ? error.message : 'Failed to retrieve stripe account status'
            );
        }
    }

    async createUserPaymentIntent(req: CreateUserPaymentIntentReq, userId: string): Promise<PaymentIntentResp> {
        const {orderId} = req;
        if (!orderId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: orderId");
        }
        const order = await this.bizOrderRpcService.getOrderById(orderId)
        if (!order) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "order is not exist");
        }
        if (order.customerUserId != userId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        if (order.status != 0) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "order status error");
        }
        const payStripeAccount = await this.payStipeAccountRepository.getOneByMerchantId(order.merchantId ?? "");
        if (!payStripeAccount || !payStripeAccount.account) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "account is not exist");
        }
        if (!payStripeAccount.status) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "account is not active");
        }
        if (!order.currency) {
            throw new CommonError(CommonErrorEnum.BIZ_ERROR, "currency is not exist");
        }
        if (!order.totalAmount) {
            order.totalAmount = 0;
        }
        if (!order.serviceFee) {
            order.serviceFee = 0;
        }
        let paymentIntent = await this.stripeConnectService.createPaymentIntentWithSplit(
            order.totalAmount - order.serviceFee,
            order.currency,
            payStripeAccount.account,
            order.serviceFee,
            {
                orderId: orderId
            }
        );
        return {
            clientSecret: paymentIntent.client_secret ?? '',
            paymentIntentId: paymentIntent.id,
        };

    }

    async verifyStripeWebhook(req: VerifyStripeWebhook): Promise<void> {
        const {payload, signature} = req;
        const config = getStripeConnectConfig();
        try {
            const event = this.stripeConnectService.getStripe().webhooks.constructEvent(
                payload,
                signature,
                config.webhookSecret
            );
            if (event.type !== 'payment_intent.succeeded') {
                throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, 'Invalid event type');
            }
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            const orderId = paymentIntent.metadata.orderId;
            await this.bizOrderRpcService.handleOrderPaymentSuccess(orderId);
        } catch (error) {
            console.error('Webhook signature verification failed:', error);
            throw new CommonError(
                CommonErrorEnum.BIZ_ERROR,
                'Webhook signature verification failed'
            );
        }
    }
}