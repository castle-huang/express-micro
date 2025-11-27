export interface StripeConnectConfig {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    clientId?: string; // OAuth client ID
}

export const getStripeConnectConfig = (): StripeConnectConfig => {
    const isTestMode = process.env.NODE_ENV !== 'production';

    return {
        secretKey: isTestMode
            ? process.env.STRIPE_SECRET_KEY_TEST!
            : process.env.STRIPE_SECRET_KEY_LIVE!,
        publishableKey: isTestMode
            ? process.env.STRIPE_PUBLISHABLE_KEY_TEST!
            : process.env.STRIPE_PUBLISHABLE_KEY_LIVE!,
        webhookSecret: isTestMode
            ? process.env.STRIPE_WEBHOOK_SECRET_TEST!
            : process.env.STRIPE_WEBHOOK_SECRET_LIVE!,
        clientId: isTestMode
            ? process.env.STRIPE_CLIENT_ID_TEST
            : process.env.STRIPE_CLIENT_ID_LIVE,
    };
};