import {
    StaffAddReq,
    StaffDeleteReq,
    StaffDropdownReq, StaffDropdownResp,
    StaffListItemResp,
    StaffListReq,
    StaffUpdateReq
} from "@/types/StaffType";
import {ServiceDropdownReq, ServiceDropdownResp} from "@/types/ServiceType";

export abstract class StaffService {
    abstract addStaff(req: StaffAddReq): Promise<any>;

    abstract updateStaff(req: StaffUpdateReq): Promise<any>;

    abstract getStaffList(req: StaffListReq): Promise<StaffListItemResp[]>;

    abstract deleteStaff(req: StaffDeleteReq): Promise<void>;

    abstract getDropdownList(req: StaffDropdownReq): Promise<StaffDropdownResp[]>;
}
