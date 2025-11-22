export interface BizService {
    /**
     * Primary key ID
     */
    id?: string;

    /**
     * BizBusiness ID
     */
    businessId?: string;

    /**
     * Service name
     */
    name?: string;

    /**
     * Service type Id
     */
    serviceTypeId?: string;

    /**
     * Service duration (minutes)
     */
    duration?: number;

    /**
     * Price
     */
    price?: number;

    /**
     * Currency type
     */
    currency?: string;

    /**
     * Number of chairs
     */
    chairs?: number;

    /**
     * Number of rooms
     */
    rooms?: number;

    /**
     *  Description
     */
    description?: string;
    /**
     * Whether active
     */
    isActive?: boolean;

    /**
     * Deletion flag
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