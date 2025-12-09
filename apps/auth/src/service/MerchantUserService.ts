import {
    LoginReq,
    LoginResp,
    ProfilesResp,
    RegisterReq, ResetPasswordReq,
    SignUpResp,
    UpdateMerchantUserReq,
    UpdatePasswordReq, VerifyCodeReq, VerifyResetPwdCodeResp
} from "@/types/AuthType";
import {
    CustomerResetPasswordReq,
    CustomerUpdatePasswordReq,
    CustomerVerifyCodeReq,
    CustomerVerifyResetPwdCodeResp
} from "@/types/AuthCustomerType";

export abstract class MerchantUserService {
    abstract register(request: RegisterReq): Promise<SignUpResp>;

    abstract login(req: LoginReq): Promise<LoginResp>;

    abstract getMerchantUser(userId: string): Promise<ProfilesResp>

    abstract updateMerchantUser(req: UpdateMerchantUserReq): Promise<void>

    abstract updatePassword(req: UpdatePasswordReq): Promise<void>

    abstract sendResetPwdEmail(email: string): Promise<Boolean>
    abstract verifyResetPwdCode(req: VerifyCodeReq): Promise<VerifyResetPwdCodeResp>
    abstract resetPwd(req: ResetPasswordReq): Promise<void>
}
