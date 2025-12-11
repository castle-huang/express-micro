import {CommonError, snakeToCamel, Service, CommonErrorEnum} from "@sojo-micro/rpc";
import {BizBusiness} from "@/types/entity/BizBusiness";
import {supabase} from "@/config/Supabase";

@Service()
export class BusinessRepository {

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
}