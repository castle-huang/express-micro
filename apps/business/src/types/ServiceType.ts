/**
 * Business List response model
 */
export interface ServiceTypeItemResp {
    id?: string;
    name?: string;
}

/**
 * Add Service request model
 */
export interface ServiceAddReq {
    businessId?: string;
    name?: string;
    serviceTypeId?: string;
    duration?: number;
    price?: number;
    currency?: string;
    chairs?: number;
    rooms?: number;
    description?: string;
}

/**
 * Service List request model
 */
export interface ServiceSearchReq {
    name?: string;
    pageNo?: number;
    pageSize?: number;
}

/**
 * Service List response model
 */
export interface ServiceSearchItemResp {
    id?: string;
    name?: string;
    duration?: number;
    price?: number;
    currency?: string;
    chairs?: number;
    rooms?: number;
    description?: string;
    isActive?: boolean;
}