/**
 * Appointment Search request model
 */
export interface OrderSearchReq {
    customerName?: string;
    pageNo?: number;
    pageSize?: number;
}

export interface OrderSearchResp {
    id: string;
    merchantId?: string;
    businessId?: string;
    totalAmount?: number;
    customerName?: string;
    phone?: string;
    email?: string;
    serviceFee?: number;
    orderTime?: number;
    paymentTime?: number;
    status?: number;
    orderItems?: OrderItemResp[]
}

/**
 * Appointment List response model
 */
export interface OrderItemResp {
    id?: string;
    appointmentTime?: number;
    serviceId?: string;
    serviceName?: string;
    staffId?: string;
    staffName?: string;
    customerName?: string;
    amount?: number;
    count?: number;
    price?: number;
    timeSlot?: string;
    updateTime?: number;
    createTime?: number;
}

export interface OrderAddReq {
    businessId?: string;
    appointmentTime?: number;
    timeSlot?: string;
    fullName?: string;
    phone?: string;
    email?: string;
    services?: OrderItem[];
}

export interface OrderItem {
    serviceId?: string;
    count?: number;
}

export interface OrderResp {
    orderId?: string;
}