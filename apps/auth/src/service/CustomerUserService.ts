import {
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
}
