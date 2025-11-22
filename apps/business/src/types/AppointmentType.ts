/**
 * Add Appointment request model
 */
export interface AppointmentReq {
    businessId: string;
    staffId: string;
    serviceId: string;
    customerName: string;
    timeSlot: string;
    appointmentTime: number;
    merchantId: string;
}

/**
 * Appointment Search request model
 */
export interface AppointmentSearchReq {
    businessId?: string;
    staffId?: string;
    serviceId?: string;
    appointmentStartTime: number;
    appointmentEndTime: number;
}

/**
 * Appointment List response model
 */
export interface AppointmentItemResp {
    id?: string;
    merchantId?: string;
    businessId?: string;
    staffId?: string;
    serviceId?: string;
    customerName?: string;
    appointmentTime?: number;
    timeSlot?: string;
    updateTime?: number;
    createTime?: number;
}
