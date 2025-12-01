/**
 * BizOrder
 */
export interface BizOrderItem {
    id?: string;
    merchantId?: string;
    businessId?: string;
    appointmentId?: string;
    serviceId?: string;
    serviceName?: string;
    price: number;
    count: number;
    amount: number;
    orderId?: string;
    staffId?: string;
    staffName?: string;
    customerName?: string;
    userId?: string;
    updateTime?: number;
    createTime?: number;
}