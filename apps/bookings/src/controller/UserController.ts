import {Controller, GET, Inject, PermitAll} from "@sojo-micro/rpc";
import {USER_API} from "../config/RpcRegistry";

export abstract class UserService {
    abstract getUser(): Promise<any>;
}

@Controller({basePath: '/api/bookings/user'})
export class UserController {
    constructor(@Inject(USER_API) private userApi: UserService) {
    }

    @GET('/test')
    @PermitAll()
    async getUser() {
        const info = await this.userApi.getUser()
        return {
            id: 1,
            name: 'John Doe',
            info
        };
    }
}