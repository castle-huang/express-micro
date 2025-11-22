import {
    AuthenticatedRequest,
    Body,
    Controller,
    Inject,
    POST,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {AppointmentService} from "@/service/AppointmentService";
import {AppointmentReq, AppointmentSearchReq} from "@/types/AppointmentType";

@Controller({basePath: '/api/biz/appointment'})
export class AppointmentController {
    constructor(@Inject() private appointmentService: AppointmentService) {
    }

    @POST()
    async addAppointment(@Body() req: AppointmentReq, @Req() auth: AuthenticatedRequest) {
        await this.appointmentService.addAppointment(req, auth.user.id);
        return ResponseUtil.success(true);
    }

    @POST('/search')
    async searchAppointment(@Body() req: AppointmentSearchReq, @Req() auth: AuthenticatedRequest) {
        const list = await this.appointmentService.searchAppointment(req, auth.user.id);
        return ResponseUtil.success(list);
    }
}