/**
 * BizOrder
 */
export interface BizOrder {
    id?: string;
    merchantId?: string;
    businessId?: string;
    serviceId?: string;
    serviceName?: string;
    staffId?: string;
    staffName?: string;
    customerName?: string;
    appointmentId?: string;
    amount?: number;
    snapshot?: string;
    updateTime?: number;
    createTime?: number;
}