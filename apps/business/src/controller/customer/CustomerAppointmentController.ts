import {
    AuthenticatedRequest, Body,
    Controller, GET,
    Inject, POST,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {AppointmentService} from "@/service/AppointmentService";
import {ServicePageReq} from "@/types/ServiceType";
import {AppointmentPageReq} from "@/types/AppointmentType";

@Controller({basePath: '/api/biz/customer/appointment'})
export class CustomerAppointmentController {
    constructor(@Inject() private appointmentService: AppointmentService) {
    }

    @POST('')
    async getAppointmentList(@Req() auth: AuthenticatedRequest, @Body() req: AppointmentPageReq) {
        req.customerUserId = auth.user.id;
        const result = await this.appointmentService.getUserAppointmentList(req);
        return ResponseUtil.success(result);
    }
}