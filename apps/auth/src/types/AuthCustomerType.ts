/**
 * Register request model
 */
export interface RegisterCustomerReq {
    fullName: string;
    email: string;
    password: string;
}

/**
 * Register response model
 */
export interface RegisterCustomerResp {
    token: string;
    refreshToken: string;
    // expiresIn: number;
    // expiresAt: number;
}

/**
 * Login request model
 */
export interface LoginCustomerReq {
    email: string;
    password: string;
}

/**
 * Login response model
 */
export interface LoginCustomerResp {
    token: string;
    refreshToken: string;
    // expiresIn: number;
    // expiresAt: number;
}

export interface GetCustomerResp {
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
    fullPhone: string;
    email: string;
}

/**
 * Update customer user request model
 */
export interface UpdateCustomerUserReq {
    id: string,
    avatarUrl: string;
    fullName: string;
    phoneCode: string;
    phone: string;
    email: string;
}

/**
 * Update customer user password request model
 */
export interface CustomerUpdatePasswordReq {
    id: string,
    oldPassword: string;
    newPassword: string;
}

export interface CustomerVerifyCodeReq {
    code: string,
    userId: string
}

export interface CustomerVerifyResetPwdCodeResp {
    resetPwdToken: string,
}

export interface CustomerResetPasswordReq {
    resetToken: string,
    password: string,
    userId: string
}
