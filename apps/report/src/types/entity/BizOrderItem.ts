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
    timeSlot?: string;
    orderId?: string;
    staffId?: string;
    staffName?: string;
    customerName?: string;
    customerUserId?: string;
    appointmentTime?: number;
    snapshot?: string;
    updateTime?: number;
    createTime?: number;
}