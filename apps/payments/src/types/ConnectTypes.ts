export interface CreateAccountParams {
    type: 'express' | 'standard' | 'custom';
    country: string;
    email: string;
    businessType?: 'individual' | 'company';
    capabilities?: {
        card_payments?: { requested: boolean };
        transfers?: { requested: boolean };
    };
    individual?: {
        first_name: string;
        last_name: string;
        email?: string;
        phone?: string;
        dob?: {
            day: number;
            month: number;
            year: number;
        };
        address?: {
            line1: string;
            city: string;
            state?: string;
            postal_code: string;
            country: string;
        };
    };
    company?: {
        name: string;
        address?: {
            line1: string;
            city: string;
            state?: string;
            postal_code: string;
            country: string;
        };
    };
    tos_acceptance?: {
        date: number;
        ip: string;
    };
    metadata?: Record<string, string>;
}

export interface AccountLinkParams {
    account: string;
    refresh_url: string;
    return_url: string;
    type: 'account_onboarding' | 'account_update';
}

export interface CreateLoginLinkParams {
    account: string;
}

export interface UpdateAccountParams {
    accountId: string;
    individual?: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
    };
    company?: {
        name?: string;
    };
    metadata?: Record<string, string>;
}

export interface AccountResponse {
    id: string;
    object: string;
    business_type: string;
    charges_enabled: boolean;
    country: string;
    created: number;
    default_currency: string;
    details_submitted: boolean;
    email: string;
    payouts_enabled: boolean;
    type: string;
    capabilities?: Record<string, string>;
    requirements?: {
        currently_due: string[];
        eventually_due: string[];
        past_due: string[];
        pending_verification: string[];
    };
}

export interface TransferParams {
    amount: number;
    currency: string;
    destination: string;
    description?: string;
    metadata?: Record<string, string>;
    source_transaction?: string;
}