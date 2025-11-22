import {StaffAddReq, StaffListItemResp, StaffListReq, StaffUpdateReq} from "@/types/StaffType";

export abstract class StaffService {
    abstract addStaff(req: StaffAddReq): Promise<any>;

    abstract updateStaff(req: StaffUpdateReq): Promise<any>;

    abstract getStaffList(req: StaffListReq): Promise<StaffListItemResp[]>;
}
