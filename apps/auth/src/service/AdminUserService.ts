// src/service/AdminUserService.ts
import {LoginReq, LoginResp, ProfilesResp, SignUpReq, SignUpResp} from "../types/AuthType";

export abstract class AdminUserService {
    abstract register(request: SignUpReq): Promise<SignUpResp>;

    abstract login(req: LoginReq): Promise<LoginResp>;

    abstract getProfiles(userId: bigint): Promise<ProfilesResp>
}
