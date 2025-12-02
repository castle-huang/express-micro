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
import {CustomerUserService} from "@/service/CustomerUserService";
import {LoginCustomerReq, RegisterCustomerReq} from "@/types/AuthCustomerType";


@Controller({basePath: '/api/auth/customer'})
export class AuthCustomerController {
    constructor(@Inject() private customerUserService: CustomerUserService) {
    }

    /**
     * Register
     */
    @POST('/register')
    @PermitAll()
    async register(@Body() req: RegisterCustomerReq) {
        const result = await this.customerUserService.register(req);
        return ResponseUtil.success(result);
    }

    /**
     * Login
     */
    @POST('/login')
    @PermitAll()
    async login(@Body() req: LoginCustomerReq) {
        const result = await this.customerUserService.login(req);
        return ResponseUtil.success(result);
    }

    /**
     * refresh-token
     */
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