import {Controller, GET} from "@sojo-micro/rpc";

@Controller({basePath: '/api/auth/user'})
export class ReportController {
    @GET('/test')
    async getUser() {
        return {
            id: 1,
            name: 'John Doe'
        };
    }
}