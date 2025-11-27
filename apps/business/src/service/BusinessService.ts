import {
    BusinessAddReq,
    BusinessDeleteReq,
    BusinessListReq,
    BusinessResp, BusinessPageReq, BusinessPageResp,
    BusinessUpdateReq
} from "@/types/BusinessType";

export abstract class BusinessService {
    abstract addBusiness(req: BusinessAddReq, userId: string): Promise<any>;

    abstract updateBusiness(req: BusinessUpdateReq, userId: string): Promise<any>;

    abstract deleteBusiness(req: BusinessDeleteReq, userId: string): Promise<any>;

    abstract getList(req: BusinessListReq, userId: string): Promise<BusinessResp[]>;
    abstract getPage(req: BusinessPageReq): Promise<BusinessPageResp>;

    abstract getById(id: string): Promise<BusinessResp>;
}
