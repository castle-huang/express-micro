import {camelToSnake, CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizService} from "@/types/entity/BizService";
import {ServicePageReq, ServiceSearchItemResp, ServiceSearchReq} from "@/types/ServiceType";
import {BusinessPageReq} from "@/types/BusinessType";
import {BizBusiness} from "@/types/entity/BizBusiness";

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
            .insert(camelToSnake(bizService));
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async update(bizService: BizService): Promise<void> {
        const {error} = await supabase
            .from('biz_service')
            .update(camelToSnake(bizService))
            .eq('id', bizService.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async countForList(req: ServiceSearchReq, merchantId: string): Promise<number> {
        let query = supabase
            .from('biz_service')
            .select('*', {count: 'exact'})
            .eq('merchant_id', merchantId)
            .eq('deleted', false);
        if (req.name) {
            query = query.ilike('name', `%${req.name}%`);
        }
        const {count, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return count?? 0;
    }

    async getList(req: ServiceSearchReq, merchantId: string) {
        const {name, pageNo = 1, pageSize = 20} = req;
        let query = supabase
            .from('biz_service')
            .select('*')
            .eq('merchant_id', merchantId)
            .eq('deleted', false);
        if (name) {
            query = query.ilike('name', `%${req.name}%`);
        }
        query = query.range((pageNo - 1) * pageSize, (pageNo * pageSize) - 1);
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(item => snakeToCamel(item));
    }

    async count(req: ServicePageReq): Promise<number> {
        let query = supabase
            .from('biz_service')
            .select('*', {count: 'exact'})
            .eq('business_id', req.businessId)
            .eq('deleted', false);
        const {count, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return count?? 0;
    }

    async page(req: ServicePageReq): Promise<BizService[]> {
        let {businessId, pageNo = 1, pageSize = 20} = req;
        let query = supabase
            .from('biz_service')
            .select('*')
            .eq('business_id', businessId)
            .eq('deleted', false);
        query = query.range((pageNo - 1) * pageSize, pageNo * pageSize);
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(record => snakeToCamel(record))
    }
}