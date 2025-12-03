import {CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizServiceType} from "@/types/entity/BizServiceType";

@Service()
export class ServiceTypeRepository {
    async getList(): Promise<BizServiceType[]> {
        let {data, error} = await supabase
            .from('biz_service_type')
            .select('*');
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(record => snakeToCamel(record)) || []
    }
}