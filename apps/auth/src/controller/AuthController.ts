import {Body, Controller, GET, Inject, PermitAll, POST, ResponseUtil} from "@sojo-micro/rpc";
import {AdminUserService} from "../service/AdminUserService";
import {LoginReq, SignUpReq} from "../types/AuthType";


@Controller({basePath: '/api/auth/admin/auth'})
export class AuthController {
    constructor(@Inject() private adminUserService: AdminUserService) {
    }
    @GET('/test')
    async getUser() {
        return {
            id: 1,
            name: 'hello'
        };
    }

    @POST('/register')
    @PermitAll()
    async register(@Body() req: SignUpReq) {
        const result = await this.adminUserService.register(req);
        return ResponseUtil.success( result);
    }

    @POST('/login')
    @PermitAll()
    async login(@Body() req: LoginReq) {
        const result = await this.adminUserService.login(req);
        return ResponseUtil.success( result);
    }
}