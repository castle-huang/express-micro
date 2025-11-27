import {
    Body,
    CommonError,
    CommonErrorEnum,
    Controller,
    DELETE,
    GET,
    Param,
    PermitAll,
    POST,
    Query, ResponseUtil
} from "@sojo-micro/rpc";
import {stripeConnectService} from '@/service/StripeConnectService';
import {
    CreateAccountParams,
    AccountLinkParams,
    UpdateAccountParams,
    TransferParams,
} from '@/types/ConnectTypes';

@Controller({basePath: '/api/payments/connect'})
export class ConnectController {
    /**
     * 创建连接账户
     */
    @POST('/create-account')
    @PermitAll()
    async createAccount(@Body() accountParams: CreateAccountParams) {
        // 验证必要参数
        if (!accountParams.type || !accountParams.country || !accountParams.email) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: type, country, email");
        }
        try {
            const account = await stripeConnectService.createAccount(accountParams);
            return ResponseUtil.success({
                accountId: account.id,
                account,
                message: 'Account created successfully. Use account link to complete onboarding.',
            });
        } catch (error) {
            console.error('Create account error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 创建测试账户
     */
    @POST('create-test-account')
    @PermitAll()
    async createTestAccount(@Body() req: any) {
        const {email, type} = req;
        if (process.env.NODE_ENV === 'production') {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED, "Test accounts can only be created in development environment");
        }
        try {
            const account = await stripeConnectService.createTestAccount(
                email,
                type || 'express'
            );
            return ResponseUtil.success({
                accountId: account.id,
                account,
                testCards: stripeConnectService.getTestPaymentMethods(),
            });
        } catch (error) {
            console.error('Create test account error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 检索账户信息
     */
    @GET('/retrieve-account/:accountId')
    @PermitAll()
    async retrieveAccount(@Param("accountId") accountId: string) {

        if (!accountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Account ID is required");
        }
        try {
            const account = await stripeConnectService.retrieveAccount(accountId);
            const isReadyForPayments = await stripeConnectService.isAccountReadyForPayments(accountId);
            return ResponseUtil.success({
                account,
                isReadyForPayments: isReadyForPayments,
            });
        } catch (error) {
            console.error('Retrieve account error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 更新账户信息
     */
    @POST('/update-account/:accountId')
    @PermitAll()
    async updateAccount(@Param("accountId") accountId: string, @Body() body: any) {
        const updateParams: UpdateAccountParams = {
            accountId,
            ...body,
        };

        if (!accountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Account ID is required");
        }
        try {
            const account = await stripeConnectService.updateAccount(updateParams);
            return ResponseUtil.success({account})
        } catch (error) {
            console.error('Update account error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 创建账户链接
     */
    @POST("create-account-link")
    @PermitAll()
    async createAccountLink(@Body() linkParams: AccountLinkParams) {

        if (!linkParams.account || !linkParams.refresh_url || !linkParams.return_url) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: account, refresh_url, return_url");
        }
        try {
            const accountLink = await stripeConnectService.createAccountLink(linkParams);
            return ResponseUtil.success({accountLink});
        } catch (error) {
            console.error('Create account link error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 创建登录链接
     */
    @POST('/create-login-link/:accountId')
    @PermitAll()
    async createLoginLink(@Param("accountId") accountId: string) {
        if (!accountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Account ID is required");
        }
        try {
            const loginLink = await stripeConnectService.createLoginLink({
                account: accountId,
            });
            return ResponseUtil.success(loginLink);
        } catch (error) {
            console.error('Create login link error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 删除账户
     */
    @DELETE('/delete-account/:accountId')
    @PermitAll()
    async deleteAccount(@Param("accountId") accountId: string) {

        if (!accountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Account ID is required");
        }
        try {
            const deletedAccount = await stripeConnectService.deleteAccount(accountId);
            return ResponseUtil.success({deletedAccount});
        } catch (error) {
            console.error('Delete account error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 列出账户
     */
    @GET('list-accounts')
    @PermitAll()
    async listAccounts(@Query() query: any) {
        try {
            const limit = parseInt(query.limit as string) || 10;
            const accounts = await stripeConnectService.listAccounts(limit);
            return ResponseUtil.success({accounts});
        } catch (error) {
            console.error('List accounts error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 创建分账支付
     */
    @POST('/create-split-payment')
    @PermitAll()
    async createSplitPayment(@Body() body: any) {

        const {
            amount,
            currency,
            destinationAccountId,
            applicationFeeAmount,
            metadata,
        } = body;

        if (!amount || !currency || !destinationAccountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: amount, currency, destinationAccountId");
        }
        try {
            // 验证目标账户是否可用
            const isReady = await stripeConnectService.isAccountReadyForPayments(destinationAccountId);
            if (!isReady) {
                throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, "Destination account is not ready to receive payments");
            }

            const paymentIntent = await stripeConnectService.createPaymentIntentWithSplit(
                amount,
                currency,
                destinationAccountId,
                applicationFeeAmount,
                metadata
            );
            return ResponseUtil.success({
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                nextActions: paymentIntent.next_action ? [
                    'Payment requires additional authentication',
                ] : ['Complete payment using the client secret'],
                testPaymentMethods: process.env.NODE_ENV !== 'production'
                    ? stripeConnectService.getTestPaymentMethods()
                    : undefined,
            });
        } catch (error) {
            console.error('Create split payment error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 创建手动转账
     */
    @POST('/create-transfer')
    @PermitAll()
    async createTransfer(@Body() transferParams: TransferParams) {

        if (!transferParams.amount || !transferParams.currency || !transferParams.destination) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Missing required parameters: amount, currency, destination");
        }
        try {
            const transfer = await stripeConnectService.createTransfer(transferParams);
            return ResponseUtil.success({transfer});
        } catch (error) {
            console.error('Create transfer error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');

        }
    }

    /**
     * 模拟完成 onboarding（测试环境专用）
     */
    @POST('/simulate-onboarding/:accountId')
    @PermitAll()
    async simulateOnboarding(@Param('accountId') accountId: string) {

        if (process.env.NODE_ENV === 'production') {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED, "This endpoint is only available in test environment");
        }

        if (!accountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Account ID is required");
        }
        try {
            await stripeConnectService.simulateAccountOnboarding(accountId);
            return ResponseUtil.success({});
        } catch (error) {
            console.error('Simulate onboarding error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }

    /**
     * 检查账户状态
     */
    @GET('/check-account-status/:accountId')
    @PermitAll()
    async checkAccountStatus(@Param('accountId') accountId: string) {
        if (!accountId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "Account ID is required");
        }
        try {
            const account = await stripeConnectService.retrieveAccount(accountId);
            const isReady = await stripeConnectService.isAccountReadyForPayments(accountId);
            return ResponseUtil.success({
                accountId: account.id,
                chargesEnabled: account.charges_enabled,
                payoutsEnabled: account.payouts_enabled,
                detailsSubmitted: account.details_submitted,
                isReadyForPayments: isReady,
                requirements: account.requirements,
                capabilities: account.capabilities,
            });
        } catch (error) {
            console.error('Check account status error:', error);
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION, error instanceof Error ? error.message : 'Internal server error');
        }
    }
}