/**
 * Register request model
 */
export interface RegisterReq {
    fullName: string;
    email: string;
    password: string;
}

/**
 * Register response model
 */
export interface SignUpResp {
    token: string;
    refreshToken: string;
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
    refreshToken: string;
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

/**
 * Update merchant user request model
 */
export interface UpdateMerchantUserReq {
    id: string,
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
    email: string;
}

/**
 * Update user password request model
 */
export interface UpdatePasswordReq {
    id: string,
    oldPassword: string;
    newPassword: string;
}

export interface SendResetPwdEmailReq {
    email: string
}

export interface VerifyCodeReq {
    code: string,
    email: string
}

export interface VerifyResetPwdCodeResp {
    resetPwdToken: string,
}

export interface ResetPasswordReq {
    resetToken: string,
    password: string,
    email: string
}