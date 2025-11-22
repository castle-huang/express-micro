import {
    BusinessAddReq,
    BusinessDeleteReq,
    BusinessListReq,
    BusinessListResp,
    BusinessUpdateReq
} from "@/types/BusinessType";

export abstract class BusinessService {
    abstract addBusiness(req: BusinessAddReq, userId: string): Promise<any>;

    abstract updateBusiness(req: BusinessUpdateReq, userId: string): Promise<any>;

    abstract deleteBusiness(req: BusinessDeleteReq, userId: string): Promise<any>;

    abstract getList(req: BusinessListReq, userId: string): Promise<BusinessListResp[]>;
}
