import {DashBoardDetailResp} from "@/types/ReportType";
import {AuthenticatedRequest} from "@sojo-micro/rpc";

export abstract class DashboardService {
    abstract getDashboard(req: AuthenticatedRequest): Promise<DashBoardDetailResp> ;
}