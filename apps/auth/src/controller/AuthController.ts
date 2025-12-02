import {
    Body,
    CommonError,
    CommonErrorEnum,
    Controller,
    Header,
    Inject, JWTUtils,
    PermitAll,
    POST,
    ResponseUtil
} from "@sojo-micro/rpc";
import {MerchantUserService} from "@/service/MerchantUserService";
import {LoginReq, RegisterReq} from "@/types/AuthType";


@Controller({basePath: '/api/auth/merchant'})
export class AuthController {
    constructor(@Inject() private adminUserService: MerchantUserService) {
    }

    /**
     * Register
     */
    @POST('/register')
    @PermitAll()
    async register(@Body() req: RegisterReq) {
        const result = await this.adminUserService.register(req);
        return ResponseUtil.success(result);
    }

    /**
     * Login
     */
    @POST('/login')
    @PermitAll()
    async login(@Body() req: LoginReq) {
        const result = await this.adminUserService.login(req);
        return ResponseUtil.success(result);
    }

    @POST('/refresh-token')
    async refreshToken(@Header("authorization") authorization: string) {
        if (!authorization) {
            throw new CommonError(CommonErrorEnum.MISSING_AUTHORIZATION_HEADER);
        }
        const token: string = authorization?.split(" ")[1] || ""
        const {accessToken, refreshToken} = JWTUtils.refreshToken(token);
        const result = {
            token: accessToken,
            refreshToken
        }
        return ResponseUtil.success(result);
    }
}