import {LoginReq, LoginResp, ProfilesResp, RegisterReq, SignUpResp, UpdateMerchantUserReq} from "@/types/AuthType";

export abstract class MerchantUserService {
    abstract register(request: RegisterReq): Promise<SignUpResp>;

    abstract login(req: LoginReq): Promise<LoginResp>;

    abstract getMerchantUser(userId: string): Promise<ProfilesResp>

    abstract updateMerchantUser(req: UpdateMerchantUserReq): Promise<void>
}
