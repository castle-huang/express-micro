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
import {
    AppointmentDeleteReq,
    AppointmentReq,
    AppointmentSearchReq,
    AppointmentUpdateReq
} from "@/types/AppointmentType";
import {StaffDeleteReq} from "@/types/StaffType";

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

    /**
     * Update appointment
     */
    @POST('/update')
    async update(@Req() auth: AuthenticatedRequest, @Body() req: AppointmentUpdateReq) {
        const appointmentReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        await this.appointmentService.updateAppointment(appointmentReq);

        return ResponseUtil.success("Staff updated successfully");
    }

    @POST("/delete")
    async delete(@Req() auth: AuthenticatedRequest, @Body() req: AppointmentDeleteReq) {
        await this.appointmentService.deleteAppointment(req.id);
        return ResponseUtil.success();
    }
}