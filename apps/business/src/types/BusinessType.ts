/**
 * Add Business request model
 */
export interface BusinessAddReq {
    merchantId: string,
    name: string,
    logoUrl: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
    businessHours: businessHourData
}

/**
 * Business hours
 */
export interface businessHourData {
    monday?: BusinessHourItem[];
    tuesday?: BusinessHourItem[];
    wednesday?: BusinessHourItem[];
    thursday?: BusinessHourItem[];
    friday?: BusinessHourItem[];
    saturday?: BusinessHourItem[];
    sunday?: BusinessHourItem[];
}

/**
 * Business hour item
 */
export interface BusinessHourItem {
    start: string;
    end: string;
}

/**
 * Update Business request model
 */
export interface BusinessUpdateReq {
    id: string,
    merchantId: string,
    name: string,
    logo_url: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
    businessHours: businessHourData
}

/**
 * Delete Business request model
 */
export interface BusinessDeleteReq {
    id: string
    merchantId: string
}

/**
 *  Business List request model
 */
export interface BusinessListReq {
    merchantId: string;
}

/**
 * Business List response model
 */
export interface BusinessListResp {
    id?: string,
    name?: string,
    logoUrl?: string,
    website?: string,
    location?: string,
    rooms?: number,
    chairs?: number,
    description?: string,
    businessHours?: businessHourData
}
