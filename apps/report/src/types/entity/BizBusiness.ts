export interface BizBusiness {
    /**
     * Primary key ID
     */
    id?: string;

    /**
     * Merchant ID
     */
    merchantId?: string;

    /**
     * Name
     */
    name?: string;

    /**
     * Logo URL
     */
    logoUrl?: string;

    /**
     * Website
     */
    website?: string;

    /**
     * Location
     */
    location?: string;

    /**
     * Room number
     */
    rooms?: number;

    /**
     * Chair number
     */
    chairs?: number;

    /**
     * Description
     */
    description?: string;

    /**
     * Business hours
     */
    businessHours?: any;

    /**
     * Update time
     */
    updateTime?: number;

    /**
     * Create time
     */
    createTime?: number;
}