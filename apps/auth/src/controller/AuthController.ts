import {Body, Controller, GET, Inject, POST} from "@sojo-micro/rpc";
import {AdminUserService} from "../service/AdminUserService";
import {LoginReq, SignUpReq, SignUpResp} from "../types/AuthModel";
import {ResponseUtil} from "../utils/ResponseUtil";


@Controller({basePath: '/api/auth/user'})
export class AuthController {
    constructor(@Inject() private adminUserService: AdminUserService) {
    }
    @GET('/test')
    async getUser() {
        return {
            id: 1,
            name: 'John Doe'
        };
    }

    @POST('/register')
    async register(@Body() req: SignUpReq) {
        const result = await this.adminUserService.register(req);
        return ResponseUtil.success( result);
    }

    @POST('/login')
    async login(@Body() req: LoginReq) {
        const result = await this.adminUserService.login(req);
        return ResponseUtil.success( result);
    }

    @GET('/profiles')
    async getProfiles(token: string) {
        const result = await this.adminUserService.getProfiles(token);
        return ResponseUtil.success( result);
    }
}