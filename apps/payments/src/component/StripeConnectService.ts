import {getStripeConnectConfig} from '@/config/StripeConnectConfig';
import {Component, Service} from "@sojo-micro/rpc";

import {
    CreateAccountParams,
    AccountLinkParams,
    CreateLoginLinkParams,
    UpdateAccountParams,
    TransferParams,
} from '@/types/ConnectTypes';
import Stripe from "stripe";

@Service()
export class StripeConnectService {
    private stripe: Stripe;
    private config: ReturnType<typeof getStripeConnectConfig>;

    constructor() {
        this.config = getStripeConnectConfig();
        this.stripe = new Stripe(this.config.secretKey, {
            apiVersion: '2025-11-17.clover',
            typescript: true,
        });
    }

    getStripe(): Stripe {
        return this.stripe;
    }

    /**
     * 创建连接账户
     * 参考: https://docs.stripe.com/api/accounts/create
     */
    async createAccount(params: CreateAccountParams): Promise<Stripe.Account> {
        try {
            console.log('Creating Stripe Connect account with params:', {
                type: params.type,
                country: params.country,
                businessType: params.businessType,
            });

            const accountData: Stripe.AccountCreateParams = {
                type: params.type,
                country: params.country,
                email: params.email,
                capabilities: params.capabilities || {
                    card_payments: {requested: true},
                    transfers: {requested: true},
                },
                metadata: {
                    ...params.metadata,
                    environment: process.env.NODE_ENV || 'development',
                    created_via: 'platform_api',
                },
            };

            // 添加业务类型
            if (params.businessType) {
                accountData.business_type = params.businessType;
            }

            // 添加个人信息（针对个人账户）
            if (params.individual) {
                accountData.individual = {
                    first_name: params.individual.first_name,
                    last_name: params.individual.last_name,
                    email: params.individual.email,
                    phone: params.individual.phone,
                    ...(params.individual.dob && {dob: params.individual.dob}),
                    ...(params.individual.address && {address: params.individual.address}),
                };
            }

            // 添加公司信息（针对公司账户）
            if (params.company) {
                accountData.company = {
                    name: params.company.name,
                    ...(params.company.address && {address: params.company.address}),
                };
            }

            // 在测试环境中，自动接受服务条款
            if (process.env.NODE_ENV !== 'production') {
                accountData.tos_acceptance = {
                    date: Math.floor(Date.now() / 1000),
                    ip: '127.0.0.1', // 测试环境的IP
                };
            } else if (params.tos_acceptance) {
                accountData.tos_acceptance = params.tos_acceptance;
            }

            const account = await this.stripe.accounts.create(accountData);

            console.log(`✅ Successfully created Stripe Connect account: ${account.id}`);
            return account;
        } catch (error) {
            console.error('❌ Error creating Stripe Connect account:', error);
            throw new Error(
                `Failed to create Stripe Connect account: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 检索账户信息
     * 参考: https://docs.stripe.com/api/accounts/retrieve
     */
    async retrieveAccount(accountId: string): Promise<Stripe.Account> {
        try {
            const account = await this.stripe.accounts.retrieve(accountId);
            return account;
        } catch (error) {
            console.error('Error retrieving account:', error);
            throw new Error(
                `Failed to retrieve account: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 更新账户信息
     * 参考: https://docs.stripe.com/api/accounts/update
     */
    async updateAccount(params: UpdateAccountParams): Promise<Stripe.Account> {
        try {
            const updateData: Stripe.AccountUpdateParams = {};

            if (params.individual) {
                updateData.individual = params.individual;
            }

            if (params.company) {
                updateData.company = params.company;
            }

            if (params.metadata) {
                updateData.metadata = params.metadata;
            }

            const account = await this.stripe.accounts.update(
                params.accountId,
                updateData
            );

            console.log(`✅ Successfully updated account: ${account.id}`);
            return account;
        } catch (error) {
            console.error('Error updating account:', error);
            throw new Error(
                `Failed to update account: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 创建账户链接（用于引导用户完成 onboarding）
     * 参考: https://docs.stripe.com/api/account_links/create
     */
    async createAccountLink(params: AccountLinkParams): Promise<Stripe.AccountLink> {
        try {
            const accountLink = await this.stripe.accountLinks.create({
                account: params.account,
                refresh_url: params.refresh_url,
                return_url: params.return_url,
                type: params.type,
            });

            console.log(`✅ Created account link for account: ${params.account}`);
            return accountLink;
        } catch (error) {
            console.error('Error creating account link:', error);
            throw new Error(
                `Failed to create account link: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 创建登录链接（用于 Express 账户登录）
     * 参考: https://docs.stripe.com/api/accounts/create_login_link
     */
    async createLoginLink(params: CreateLoginLinkParams): Promise<Stripe.LoginLink> {
        try {
            const loginLink = await this.stripe.accounts.createLoginLink(
                params.account
            );

            console.log(`✅ Created login link for account: ${params.account}`);
            return loginLink;
        } catch (error) {
            console.error('Error creating login link:', error);
            throw new Error(
                `Failed to create login link: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 删除账户
     * 参考: https://docs.stripe.com/api/accounts/delete
     */
    async deleteAccount(accountId: string): Promise<Stripe.DeletedAccount> {
        try {
            const deletedAccount = await this.stripe.accounts.del(accountId);
            console.log(`✅ Successfully deleted account: ${accountId}`);
            return deletedAccount;
        } catch (error) {
            console.error('Error deleting account:', error);
            throw new Error(
                `Failed to delete account: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 列出所有账户
     * 参考: https://docs.stripe.com/api/accounts/list
     */
    async listAccounts(limit: number = 10): Promise<Stripe.ApiList<Stripe.Account>> {
        try {
            const accounts = await this.stripe.accounts.list({
                limit,
            });
            return accounts;
        } catch (error) {
            console.error('Error listing accounts:', error);
            throw new Error(
                `Failed to list accounts: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 创建转账
     * 参考: https://docs.stripe.com/api/transfers/create
     */
    async createTransfer(params: TransferParams): Promise<Stripe.Transfer> {
        try {
            const transfer = await this.stripe.transfers.create({
                amount: params.amount,
                currency: params.currency,
                destination: params.destination,
                description: params.description,
                metadata: params.metadata,
                ...(params.source_transaction && {
                    source_transaction: params.source_transaction,
                }),
            });

            console.log(`✅ Created transfer: ${transfer.id} to ${params.destination}`);
            return transfer;
        } catch (error) {
            console.error('Error creating transfer:', error);
            throw new Error(
                `Failed to create transfer: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 创建支持分账的支付意向
     * 参考: https://docs.stripe.com/api/payment_intents/create
     */
    async createPaymentIntentWithSplit(
        amount: number,
        currency: string,
        destinationAccountId: string,
        applicationFeeAmount?: number,
        metadata?: Record<string, string>
    ): Promise<Stripe.PaymentIntent> {
        try {
            const paymentIntentData: Stripe.PaymentIntentCreateParams = {
                amount,
                currency,
                payment_method_types: ['card'],
                automatic_payment_methods: {enabled: false},
                metadata: {
                    ...metadata,
                    split_destination: destinationAccountId,
                    environment: process.env.NODE_ENV || 'development',
                },
            };

            // 如果指定了平台费用
            if (applicationFeeAmount) {
                paymentIntentData.application_fee_amount = applicationFeeAmount;
                paymentIntentData.on_behalf_of = destinationAccountId;
                paymentIntentData.transfer_data = {
                    destination: destinationAccountId,
                };
            } else {
                // 直接分账到目标账户
                paymentIntentData.transfer_data = {
                    destination: destinationAccountId,
                };
            }

            const paymentIntent = await this.stripe.paymentIntents.create(
                paymentIntentData
            );

            console.log(`✅ Created payment intent with split: ${paymentIntent.id}`);
            return paymentIntent;
        } catch (error) {
            console.error('Error creating payment intent with split:', error);
            throw new Error(
                `Failed to create payment intent with split: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 创建测试账户（用于开发环境）
     */
    async createTestAccount(
        email?: string,
        type: 'express' | 'standard' = 'express'
    ): Promise<Stripe.Account> {
        const testEmail = email || `test.account.${Date.now()}@example.com`;

        const account = await this.createAccount({
            type,
            country: 'US',
            email: testEmail,
            businessType: 'individual',
            individual: {
                first_name: 'Test',
                last_name: 'User',
                email: testEmail,
                phone: '+15555555555',
                dob: {
                    day: 1,
                    month: 1,
                    year: 1990,
                },
                address: {
                    line1: '123 Test Street',
                    city: 'Test City',
                    state: 'CA',
                    postal_code: '12345',
                    country: 'US',
                },
            },
            capabilities: {
                card_payments: {requested: true},
                transfers: {requested: true},
            },
            metadata: {
                test_account: 'true',
                created_via: 'test_setup',
            },
        });

        console.log(`🎯 Created test account: ${account.id} (${account.email})`);
        return account;
    }

    /**
     * 模拟完成账户 onboarding（测试环境专用）
     */
    async simulateAccountOnboarding(accountId: string): Promise<void> {
        if (process.env.NODE_ENV === 'production') {
            throw new Error('This method is only available in test environment');
        }

        try {
            // 在测试环境中，我们可以更新账户来模拟完成 onboarding
            await this.stripe.accounts.update(accountId, {
                individual: {
                    verification: {
                        document: {
                            back: 'file_identity_document_success', // 测试文件ID
                            front: 'file_identity_document_success', // 测试文件ID
                        },
                    },
                },
                // 设置账户为已激活状态
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: '127.0.0.1',
                },
            });

            console.log(`✅ Simulated onboarding completion for account: ${accountId}`);
        } catch (error) {
            console.error('Error simulating account onboarding:', error);
            throw new Error(
                `Failed to simulate account onboarding: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    /**
     * 检查账户是否准备好接收付款
     */
    async isAccountReadyForPayments(accountId: string): Promise<boolean> {
        try {
            const account = await this.retrieveAccount(accountId);
            return account.charges_enabled && account.payouts_enabled;
        } catch (error) {
            console.error('Error checking account readiness:', error);
            return false;
        }
    }

    /**
     * 获取测试银行卡信息
     */
    getTestPaymentMethods(): Array<{
        type: string;
        card: {
            number: string;
            exp_month: number;
            exp_year: number;
            cvc: string;
        };
        billing_details: {
            name: string;
            email: string;
        };
    }> {
        return [
            {
                type: 'card',
                card: {
                    number: '4242424242424242',
                    exp_month: 12,
                    exp_year: new Date().getFullYear() + 1,
                    cvc: '123',
                },
                billing_details: {
                    name: 'Test User',
                    email: 'test@example.com',
                },
            },
            {
                type: 'card',
                card: {
                    number: '4000002500003155',
                    exp_month: 12,
                    exp_year: new Date().getFullYear() + 1,
                    cvc: '123',
                },
                billing_details: {
                    name: '3D Secure User',
                    email: 'test@example.com',
                },
            },
        ];
    }
}