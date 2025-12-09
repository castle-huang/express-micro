import {
    CustomerResetPasswordReq,
    CustomerUpdatePasswordReq, CustomerVerifyCodeReq, CustomerVerifyResetPwdCodeResp,
    GetCustomerResp,
    LoginCustomerReq,
    LoginCustomerResp,
    RegisterCustomerReq,
    RegisterCustomerResp, UpdateCustomerUserReq
} from "@/types/AuthCustomerType";

export abstract class CustomerUserService {
    abstract register(request: RegisterCustomerReq): Promise<RegisterCustomerResp>;

    abstract login(req: LoginCustomerReq): Promise<LoginCustomerResp>;

    abstract getCustomerUser(userId: string): Promise<GetCustomerResp>

    abstract updateCustomerUser(req: UpdateCustomerUserReq): Promise<void>

    abstract updatePassword(req: CustomerUpdatePasswordReq): Promise<void>
    abstract sendResetPwdEmail(email: string): Promise<Boolean>
    abstract verifyResetPwdCode(req: CustomerVerifyCodeReq): Promise<CustomerVerifyResetPwdCodeResp>
    abstract resetPwd(req: CustomerResetPasswordReq): Promise<void>

}
