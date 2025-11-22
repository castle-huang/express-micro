import {AppointmentItemResp, AppointmentReq, AppointmentSearchReq} from "@/types/AppointmentType";

export abstract class AppointmentService {
    abstract addAppointment(req: AppointmentReq, userId: string): Promise<void>;

    abstract searchAppointment(req: AppointmentSearchReq, userId: string): Promise<AppointmentItemResp[]>;
}
