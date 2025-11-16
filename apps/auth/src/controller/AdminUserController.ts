import {AuthenticatedRequest, Controller, Form, GET, Inject, Param, Query, Req, ResponseUtil} from "@sojo-micro/rpc";
import {AdminUserService} from "../service/AdminUserService";


@Controller({basePath: '/api/auth/admin/user'})
export class AdminUserController {
    constructor(@Inject() private adminUserService: AdminUserService) {
    }

    @GET('/profiles')
    async getProfiles(@Req() authReq: AuthenticatedRequest) {
        const result = await this.adminUserService.getProfiles(authReq.user.id);
        return ResponseUtil.success(result);
    }
}