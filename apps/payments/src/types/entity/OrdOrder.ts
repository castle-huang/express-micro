export interface OrdOrder {
    /**
     * Primary key ID
     */
    id?: string;

    /**
     * Service ID
     */
    serviceId?: string;

    /**
     * Service name
     */
    serviceName?: string;

    /**
     * Staff ID
     */
    staffId?: string;

    /**
     * Staff name
     */
    staffName?: string;

    /**
     * Amount
     */
    amount?: number;

    /**
     * Update time
     */
    updateTime?: Date;

    /**
     * Create time
     */
    createTime?: Date;

    /**
     * Snapshot data
     */
    snapshot?: any;
}