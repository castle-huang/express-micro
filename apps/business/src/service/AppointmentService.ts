import {
    AppointmentItemResp,
    AppointmentReq,
    AppointmentSearchReq,
    AppointmentUserItemResp
} from "@/types/AppointmentType";

export abstract class AppointmentService {
    abstract addAppointment(req: AppointmentReq, userId: string): Promise<void>;

    abstract searchAppointment(req: AppointmentSearchReq, userId: string): Promise<AppointmentItemResp[]>;

    abstract getUserAppointmentList(customerUserId: string): Promise<AppointmentUserItemResp[]>;
}
