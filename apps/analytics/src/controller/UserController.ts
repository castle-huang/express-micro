import {Controller, GET, Inject} from "@sojo-micro/rpc";
import {UserService} from "../service/UserService";

@Controller({basePath: '/api/auth/user'})
export class UserController {
    constructor(@Inject() private userService: UserService) {
    }

    @GET('/test')
    async getUser() {
        const hello = await this.userService.hello()
        return {
            id: 1,
            name: 'John Doe',
            hello
        };
    }
}