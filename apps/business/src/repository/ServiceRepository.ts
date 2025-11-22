import {CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizService} from "@/types/entity/BizService";
import {ServiceSearchReq} from "@/types/ServiceType";

@Service()
export class ServiceRepository {
    async getOneById(id: string): Promise<BizService> {
        const {data, error} = await supabase
            .from('biz_service')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }

    async insert(bizService: BizService) {
        const {error} = await supabase
            .from('biz_service')
            .insert(bizService);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async getList(req: ServiceSearchReq, merchantId: string) {
        const {name, pageNo = 1, pageSize = 20} = req;
        let query = supabase
            .from('biz_service')
            .select('*')
            .eq('merchant_id', merchantId);
        if (name) {
            query = query.ilike('name', `%${req.name}%`);
        }
        query = query.range((pageNo - 1) * pageSize, pageNo * pageSize);
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(item => snakeToCamel(item));
    }
}