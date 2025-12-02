import {Controller, GET, Inject, PermitAll, Req} from "@sojo-micro/rpc";
import {UserService} from "@/service/UserService";
import {AuthenticatedRequest, JWTUtils} from "@sojo-micro/rpc/dist/utils/JWTUtils";

@Controller({basePath: '/api/auth/user'})
export class UserController {
    constructor(@Inject() private userService: UserService) {
    }

    @PermitAll()
    @GET('/test')
    async getUser() {
        const hello = await this.userService.hello()
        return {
            id: 1,
            name: 'John Doe',
            hello
        };
    }

    @GET('/token')
    @PermitAll()
    async token() {
        const payload: AuthenticatedRequest = {
            user: {
                id: "1",
            }
        } as AuthenticatedRequest;
        const {accessToken, refreshToken} = JWTUtils.generateToken(payload);
        return {
            token: accessToken,
            refreshToken
        };
    }

    @GET('/test2')
    async getUser2(@Req() request: AuthenticatedRequest) {
        const hello = await this.userService.hello()
        return {
            id: request.user.id,
            name: 'John Doe',
            hello
        };
    }
}