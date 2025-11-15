/**
 * Add Business request model
 */
export interface BusinessAddReq {
    ownerId: string,
    name: string,
    logo_url: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
    business_hours: string
}

/**
 * Update Business request model
 */
export interface BusinessUpdateReq {
    id: string,
    ownerId: string,
    name: string,
    logo_url: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
    business_hours: string
}

/**
 *  Business List request model
 */
export interface BusinessListReq {
    owerId: string,
}

/**
 * Business List response model
 */
export interface BusinessListResp {
    id: string,
    ownerId: string,
    name: string,
    logo_url: string,
    website: string,
    location: string,
    rooms: number,
    chairs: number,
    description: string,
    business_hours: string
}

/**
 *  Delete business  request model
 */
export interface BusinessListReq {
    id: string,
}
