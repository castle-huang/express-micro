import {CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizService} from "@/types/entity/BizService";

@Service()
export class ServiceRepository {
    async getOneById(id: string): Promise<BizService> {
        const {data, error} = await supabase
            .from('biz_service')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }
}