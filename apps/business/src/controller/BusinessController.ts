import {
    AuthenticatedRequest,
    Body,
    Controller,
    DELETE,
    GET,
    Inject,
    PermitAll,
    POST,
    PUT,
    Req,
    ResponseUtil
} from "@sojo-micro/rpc";
import {BusinessService} from "../service/BusinessService";
import {BusinessAddReq, BusinessListReq, BusinessListResp, BusinessUpdateReq} from "../types/BusinessType";

@Controller({basePath: '/api/admin/business'})
export class BusinessController {
    constructor(@Inject() private businessService: BusinessService) {
    }
    @GET('/test')
    async getUser() {
        return {
            id: 1,
            name: 'John Doe'
        };
    }

    /**
     * Add new business
     */
    @POST('')
    @PermitAll()
    async add(@Req() authReq: AuthenticatedRequest,
              @Body() req: BusinessAddReq) {
        // TODO
        return ResponseUtil.success( );
    }

    /**
     * Update business
     */
    @PUT('')
    @PermitAll()
    async update(@Body() req: BusinessUpdateReq) {
        // TODO
        return ResponseUtil.success( );
    }

    /**
     * Business list
     */
    @PermitAll()
    async list(@Req() authReq: AuthenticatedRequest, @Body() req: BusinessListReq, resp: BusinessListResp) {
        // TODO
        return ResponseUtil.success( );
    }

    /**
     * Delete business
     */
    @DELETE('')
    @PermitAll()
    async delete(@Body() req: BusinessUpdateReq) {
        // TODO
        return ResponseUtil.success( );
    }
}