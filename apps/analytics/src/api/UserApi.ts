import {RpcMethod, RpcService} from "@sojo-micro/rpc";

@RpcService({name: "user-api"})
export class UserApi {

    @RpcMethod()
    async getUser() {
        return {
            id: 11,
            name: 'John Doe'
        }
    }
}