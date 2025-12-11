import {CommonError, snakeToCamel, Service, CommonErrorEnum, camelToSnake} from "@sojo-micro/rpc";
import {BizBusiness} from "@/types/entity/BizBusiness";
import {supabase} from "@/config/Supabase";
import {OrderSearchReq} from "@/types/OrderType";
import {BizOrder} from "@/types/entity/BizOrder";
import {BusinessPageReq} from "@/types/BusinessType";
import {ServiceDropdownReq} from "@/types/ServiceType";

@Service()
export class BusinessRepository {
    async insert(business: BizBusiness): Promise<void> {
        const {error} = await supabase
            .from('biz_business')
            .insert(camelToSnake(business))
            .select('*')
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async getOneById(id: string): Promise<BizBusiness> {
        const {data, error} = await supabase
            .from('biz_business')
            .select('*')
            .eq('id', id).maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }

    async deleteById(id: string): Promise<void> {
        const {error} = await supabase
            .from('biz_business')
            .delete()
            .eq('id', id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async update(business: BizBusiness): Promise<void> {
        const {error} = await supabase
            .from('biz_business')
            .update(camelToSnake(business))
            .eq('id', business.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async getList(merchantId: string): Promise<BizBusiness[]> {
        const {data, error} = await supabase
            .from('biz_business')
            .select('*')
            .eq('merchant_id', merchantId)
            .eq('deleted', false)
        ;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data.map(item => snakeToCamel(item));
    }

    async count(req: BusinessPageReq): Promise<number> {
        let query = supabase
            .from('biz_business')
            .select('*', {count: 'exact'})
            .eq('deleted', false);
        if (req.name) {
            query = query.ilike('name', req.name);
        }
        const {count, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return count?? 0;
    }

    async page(req: BusinessPageReq): Promise<BizBusiness[]> {
        let {name, pageNo = 1, pageSize = 20} = req;
        let query = supabase
            .from('biz_business')
            .select('*')
            .eq('deleted', false);
        if (name) {
            query = query.ilike('name', name);
        }
        query = query.range((pageNo - 1) * pageSize, (pageNo * pageSize) - 1);
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(record => snakeToCamel(record))
    }

    async getDropdownList(merchantId: string) {
        let query = supabase
            .from('biz_business')
            .select('*')
            .eq('merchant_id', merchantId)
            .eq('deleted', false);
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(item => snakeToCamel(item));
    }


}