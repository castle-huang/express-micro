import {
    LoginReq,
    LoginResp,
    ProfilesResp,
    RegisterReq,
    SignUpResp,
    UpdateMerchantUserReq,
    UpdatePasswordReq
} from "@/types/AuthType";
import {CustomerUpdatePasswordReq} from "@/types/AuthCustomerType";

export abstract class MerchantUserService {
    abstract register(request: RegisterReq): Promise<SignUpResp>;

    abstract login(req: LoginReq): Promise<LoginResp>;

    abstract getMerchantUser(userId: string): Promise<ProfilesResp>

    abstract updateMerchantUser(req: UpdateMerchantUserReq): Promise<void>

    abstract updatePassword(req: UpdatePasswordReq): Promise<void>
}
