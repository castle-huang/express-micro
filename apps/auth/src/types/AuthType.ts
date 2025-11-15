/**
 * Register request model
 */
export interface SignUpReq {
    contactName: string;
    email: string;
    password: string;
}

/**
 * Register response model
 */
export interface SignUpResp {
    token: string;
    // expiresIn: number;
    // expiresAt: number;
}

/**
 * Login request model
 */
export interface LoginReq {
    email: string;
    password: string;
}

/**
 * Login response model
 */
export interface LoginResp {
    token: string;
    // expiresIn: number;
    // expiresAt: number;
}

export interface ProfilesResp {
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
    fullPhone: string;
    email: string;
}