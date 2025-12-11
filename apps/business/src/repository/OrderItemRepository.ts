import {camelToSnake, CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
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

    async insert(bizOrderItem: Partial<BizOrderItem>): Promise<void> {
        const {error} = await supabase
            .from('biz_order_item')
            .insert(camelToSnake(bizOrderItem));
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async updateById(bizOrderItem: Partial<BizOrderItem>): Promise<void> {
        const {error} = await supabase
            .from('biz_order_item')
            .update(camelToSnake(bizOrderItem))
            .eq('id', bizOrderItem.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async getOrderItemListByOrderId(orderId: string): Promise<BizOrderItem[]> {
        const {data, error} = await supabase
            .from('biz_order_item')
            .select('*')
            .eq('order_id', orderId)
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data.map(item => snakeToCamel(item));
    }
}