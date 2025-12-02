import {
    ServiceAddReq, ServiceDeleteReq, ServiceDropdownReq, ServiceDropdownResp,
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

    abstract delete(req: ServiceDeleteReq): Promise<void>

    abstract getDropdownList(req: ServiceDropdownReq): Promise<ServiceDropdownResp[]>;
}