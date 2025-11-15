import {AuthenticatedRequest, Controller, GET, Inject, Param, Req, ResponseUtil} from "@sojo-micro/rpc";
import {AdminUserService} from "../service/AdminUserService";


@Controller({basePath: '/api/admin/user'})
export class AdminUserController {
    constructor(@Inject() private adminUserService: AdminUserService) {
    }

    @GET('/profiles/:userId')
    async getProfiles(@Req() req: AuthenticatedRequest) {
        const result = await this.adminUserService.getProfiles(req.user.id);
        return ResponseUtil.success(result);
    }
}