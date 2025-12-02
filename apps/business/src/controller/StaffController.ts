import {
    AuthenticatedRequest,
    Body,
    Controller,
    Inject,
    POST,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {
    StaffAddReq,
    StaffDeleteReq,
    StaffDropdownReq,
    StaffListItemResp,
    StaffListReq,
    StaffUpdateReq
} from "@/types/StaffType";
import {StaffService} from "@/service/StaffService";
import {ServiceDeleteReq, ServiceDropdownReq} from "@/types/ServiceType";

@Controller({basePath: '/api/biz/staff'})
export class StaffController {
    constructor(@Inject() private staffService: StaffService) {
    }

    @POST('/add')
    async add(@Req() auth: AuthenticatedRequest, @Body() req: StaffAddReq) {
        const staffReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        await this.staffService.addStaff(staffReq);
        return ResponseUtil.success(true);
    }

    /**
     * Update staff
     */
    @POST('/update')
    async update(@Req() auth: AuthenticatedRequest, @Body() req: StaffUpdateReq) {
        const staffReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        await this.staffService.updateStaff(staffReq);

        return ResponseUtil.success("Staff updated successfully");
    }


    /**
     * Staff list
     */
    @POST('/list')
    async list(@Req() auth: AuthenticatedRequest, @Body() req: StaffListReq) {
        const newReq = {
            ...req,
            merchantId: auth.user.merchantId,
        };
        let staffListItemList: StaffListItemResp[] = await this.staffService.getStaffList(newReq);
        return ResponseUtil.success(staffListItemList);
    }

    @POST("/delete")
    async delete(@Req() auth: AuthenticatedRequest, @Body() req: StaffDeleteReq) {
        await this.staffService.deleteStaff(req);
        return ResponseUtil.success();
    }

    @POST("/dropdown")
    async getDropdownList(@Body() req: StaffDropdownReq, @Req() auth: AuthenticatedRequest) {
        const data = await this.staffService.getDropdownList(req)
        return ResponseUtil.success(data);
    }
}