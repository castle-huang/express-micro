import {camelToSnake, CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizOrder} from "@/types/entity/BizOrder";
import {OrderSearchReq} from "@/types/OrderType";
import {ServicePageReq} from "@/types/ServiceType";

@Service()
export class OrderRepository {
    async getOneById(id: string): Promise<BizOrder> {
        const {data, error} = await supabase
            .from('biz_order')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }

    async insert(bizOrder: Partial<BizOrder>): Promise<void> {
        const {error} = await supabase
            .from('biz_order')
            .insert(camelToSnake(bizOrder));
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async updateById(bizOrder: Partial<BizOrder>): Promise<void> {
        const {error} = await supabase
            .from('biz_order')
            .update(camelToSnake(bizOrder))
            .eq('id', bizOrder.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async searchList(req: OrderSearchReq, merchantId: string): Promise<BizOrder[]> {
        let {customerName, pageNo = 1, pageSize = 20} = req;
        let query = supabase
            .from('biz_order')
            .select('*')
            .eq('merchant_id', merchantId);
        if (customerName) {
            query = query.ilike('customer_name', customerName);
        }
        query = query.range((pageNo - 1) * pageSize, pageNo * pageSize);
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.map(record => snakeToCamel(record))
    }

    async count(req: OrderSearchReq, merchantId: string): Promise<number> {
        let query = supabase
            .from('biz_order')
            .select('*', {count: 'exact'})
            .eq('merchant_id', merchantId);
        if (req.customerName) {
            query = query.ilike('customer_name', req.customerName);
        }
        const {count, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return count?? 0;
    }
}