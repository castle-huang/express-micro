import {Controller, GET, Inject} from "@sojo-micro/rpc";

interface UserService {
    getUser(): Promise<any>;
}

@Controller({basePath: '/api/auth/user'})
export class UserController {
    constructor(@Inject('demo_user-api') private userApi: UserService) {
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