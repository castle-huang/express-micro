export interface DashBoardDetailResp {
    changeRevenue?: number;
    totalAppointment?: number;
    customerRetention?: number;
    newCustomers?: number;
    recentBookedAppointments?: AppointmentItemResp[];
    revenueTrends?: RevenueTrendsItemResp[];
    bookingsService?: BookingsServiceItemResp[];
}

export interface AppointmentItemResp {
    id?: string;
    customerName?: string;
    serviceName?: string;
    staffName?: string;
    appointmentTime?: number;
    bookedAt?: string;
}

export interface RevenueTrendsItemResp {
    date?: string;
    revenue?: number;
}

export interface BookingsServiceItemResp {
    serviceName?: string;
    bookings?: number;
}
