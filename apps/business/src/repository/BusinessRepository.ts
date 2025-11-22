import {CommonError, snakeToCamel, Service, CommonErrorEnum, camelToSnake} from "@sojo-micro/rpc";
import {BizBusiness} from "@/types/entity/BizBusiness";
import {supabase} from "@/config/Supabase";

@Service()
export class BusinessRepository {
    async insert(business: BizBusiness): Promise<void> {
        const {error} = await supabase
            .from('biz_business')
            .insert(camelToSnake(business))
            .select('*')
            .single();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async getOneById(id: string): Promise<BizBusiness> {
        const {data, error} = await supabase
            .from('biz_business')
            .select('*')
            .eq('id', id).single();
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
}