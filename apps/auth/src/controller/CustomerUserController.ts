import {
    AuthenticatedRequest,
    BaseResponse,
    Body,
    Controller,
    CustomerAuthenticatedRequest,
    GET,
    Inject,
    PUT,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {ProfilesResp} from "../types/AuthType";
import {CustomerUserService} from "@/service/CustomerUserService";
import {GetCustomerResp, UpdateCustomerUserReq} from "@/types/AuthCustomerType";


@Controller({basePath: '/api/auth/customer/user'})
export class CustomerUserController {
    constructor(@Inject() private customerUserService: CustomerUserService) {
    }

    @GET()
    async getCustomerUser(@Req() authReq: AuthenticatedRequest): Promise<BaseResponse<ProfilesResp>>  {
        const result = await this.customerUserService.getCustomerUser(authReq.user.id);
        return ResponseUtil.success(result);
    }

    @PUT()
    async updateCustomerUser(@Req() authReq: AuthenticatedRequest, @Body() req: UpdateCustomerUserReq): Promise<BaseResponse<GetCustomerResp>>  {
        req.id = authReq.user.id;
        await this.customerUserService.updateCustomerUser(req);
        return ResponseUtil.success();
    }
}