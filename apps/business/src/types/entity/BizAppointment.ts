export class BizAppointment {
    /**
     * Primary key ID
     */
    id?: string;

    /**
     * Merchant ID
     */
    merchantId?: string;

    /**
     * BizBusiness ID
     */
    businessId?: string;

    /**
     * Staff ID
     */
    staffId?: string;

    /**
     * Service ID
     */
    serviceId?: string;

    /**
     * Customer name
     */
    customerName?: string;

    /**
     * Appointment time
     */
    appointmentTime?: number;

    /**
     * Time slot
     */
    timeSlot?: string;

    /**
     * Update time
     */
    updateTime?: number;

    /**
     * Create time
     */
    createTime?: number;
}