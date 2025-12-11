export interface StripeConnectConfig {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    clientId?: string; // OAuth client ID
}

export const getStripeConnectConfig = (): StripeConnectConfig => {
    const isTestMode = process.env.NODE_ENV !== 'production';

    return {
        secretKey: process.env.STRIPE_SECRET_KEY || "",
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "",
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
        clientId: process.env.STRIPE_CLIENT_ID || "",
    };
};