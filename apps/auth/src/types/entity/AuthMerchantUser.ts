export interface AuthMerchantUser {
    /**
     * Primary key ID
     */
    id?: string;

    /**
     * Merchant ID
     */
    merchantId?: string;

    /**
     * Type (1: merchant owner)
     */
    type?: number;

    /**
     * Avatar URL
     */
    avatarUrl?: string;

    /**
     * Email address
     */
    email?: string;

    /**
     * Full name
     */
    fullName?: string;

    /**
     * Phone area code
     */
    phoneCode?: string;

    /**
     * Phone number
     */
    phone?: string;

    /**
     * Full phone number (including area code)
     */
    fullPhone?: string;

    /**
     * Password
     */
    password?: string;

    /**
     * Whether deleted
     */
    deleted?: boolean;

    /**
     * Update time
     */
    updateTime?: number;

    /**
     * Create time
     */
    createTime?: number;
}