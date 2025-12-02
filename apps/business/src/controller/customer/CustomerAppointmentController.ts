import {
    AuthenticatedRequest,
    Controller, GET,
    Inject,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {AppointmentService} from "@/service/AppointmentService";

@Controller({basePath: '/api/biz/customer/appointment'})
export class CustomerOrderController {
    constructor(@Inject() private appointmentService: AppointmentService) {
    }

    @GET()
    async getAppointmentList(@Req() auth: AuthenticatedRequest) {
        const result = await this.appointmentService.getUserAppointmentList(auth.user.id);
        return ResponseUtil.success(result);
    }
}