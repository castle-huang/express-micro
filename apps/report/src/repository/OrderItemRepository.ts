import {CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizOrderItem} from "@/types/entity/BizOrderItem";

@Service()
export class OrderItemRepository {
    async getOneById(id: string): Promise<BizOrderItem> {
        const {data, error} = await supabase
            .from('biz_order_item')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }
}