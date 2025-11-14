import {Controller, GET, Inject} from "@sojo-micro/rpc";
import {USER_API} from "../config/RpcRegistry";

export abstract class UserService {
    abstract getUser(): Promise<any>;
}

@Controller({basePath: '/api/auth/user'})
export class UserController {
    constructor(@Inject(USER_API) private userApi: UserService) {
    }

    @GET('/test')
    async getUser() {
        const info = await this.userApi.getUser()
        return {
            id: 1,
            name: 'John Doe',
            info
        };
    }
}