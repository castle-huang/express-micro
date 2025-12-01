import {
    ServiceAddReq,
    ServicePageReq, ServicePageResp,
    ServiceSearchItemResp,
    ServiceSearchReq,
    ServiceTypeItemResp, ServiceUpdateReq
} from "@/types/ServiceType";

export abstract class ServiceService {

    abstract getTypeList(): Promise<ServiceTypeItemResp[]>;

    abstract addService(req: ServiceAddReq, userId: string): Promise<void>;
    abstract updateService(req: ServiceUpdateReq, userId: string): Promise<void>;

    abstract getList(req: ServiceSearchReq, userId: string): Promise<ServicePageResp>;

    abstract page(req: ServicePageReq): Promise<ServicePageResp>
}