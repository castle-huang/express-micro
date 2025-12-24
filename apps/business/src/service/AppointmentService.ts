import {
    AppointmentItemResp, AppointmentPageReq, AppointmentPageResp,
    AppointmentReq,
    AppointmentSearchReq, AppointmentUpdateReq,
    AppointmentUserItemResp
} from "@/types/AppointmentType";

export abstract class AppointmentService {
    abstract addAppointment(req: AppointmentReq, userId: string): Promise<void>;
    abstract updateAppointment(req: AppointmentUpdateReq): Promise<void>;

    abstract searchAppointment(req: AppointmentSearchReq, userId: string): Promise<AppointmentItemResp[]>;

    abstract getUserAppointmentList(appointmentPageReq: AppointmentPageReq): Promise<AppointmentPageResp>;

    abstract deleteAppointment(id: string): Promise<void>;
}
