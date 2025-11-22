/**
 * Appointment Search request model
 */
export interface OrderSearchReq {
    customerName?: string;
    pageNo?: number;
    pageSize?: number;
}

/**
 * Appointment List response model
 */
export interface OrderItemResp {
    id?: string;
    merchantId?: string;
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    staffId?: string;
    staffName?: string;
    customerName?: string;
    amount?: number;
    snapshot?: string;
    updateTime?: string;
    createTime?: string;
}