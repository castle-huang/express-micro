/**
 * Add Staff request model
 */
export interface StaffAddReq {
    merchantId: string,
    businessId: string,
    name: string,
    email: string,
    phoneCode?: string,
    phone?: string,
}

/**
 * Update Staff request model
 */
export interface StaffUpdateReq {
    id: string,
    businessId: string,
    name: string,
    email: string,
    phoneCode?: string,
    phone?: string,
}

/**
 *  Staff List request model
 */
export interface StaffListReq {
    merchantId?: string;
    businessId?: string;
    name?: string;
}

/**
 * Staff List response model
 */
export interface StaffListItemResp {
    id?: string;
    merchantId?: string;
    businessId?: string;
    businessName?: string;
    name?: string;
    email?: string;
    fullPhone?: string;
}

