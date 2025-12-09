export interface CreateStripeAccountReq {
    country?: string;
    email?: string;
    businessType?: 'individual' | 'company';
}

export interface CreateAccountLinkReq {
    id?: string;
    refreshUrl: string;
    returnUrl: string;
}

export interface CreateAccountLinkResp {
    url: string;
}

export interface StripeAccountResp {
    id?: string;
    status?: boolean;
}

export interface CreateLoginLinkReq {
    id?: string;
}


export interface CreateLoginLinkResp {
    url: string;
}

export interface CreateUserPaymentIntentReq {
    orderId?: string,
}

export interface PaymentIntentReq {
    amount?: number,
    currency?: string,
    account?: string,
    fee?: number,
    orderId?: string,
}

export interface PaymentIntentResp {
    clientSecret?: string,
    paymentIntentId?: string,
}

export interface VerifyStripeWebhook {
    payload: string;
    signature: string;
}