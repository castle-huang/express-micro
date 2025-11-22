import {ServiceAddReq, ServiceSearchItemResp, ServiceSearchReq, ServiceTypeItemResp} from "@/types/ServiceType";

export abstract class ServiceService {

    abstract getTypeList(): Promise<ServiceTypeItemResp[]>;

    abstract addService(req: ServiceAddReq, userId: string): Promise<void>;

    abstract getList(req: ServiceSearchReq, userId: string): Promise<ServiceSearchItemResp[]>;
}