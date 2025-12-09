/**
 * BizOrder
 */
export interface BizOrder {
    id: string;
    merchantId?: string;
    businessId?: string;
    customerName?: string;
    customerUserId?: string;
    phone?: string;
    currency?: string;
    email?: string;
    totalAmount?: number;
    serviceFee?: number;
    status?: number;
    orderTime?: number;
    paymentTime?: number;
    completeTime?: number;
    updateTime?: number;
    createTime?: number;
}