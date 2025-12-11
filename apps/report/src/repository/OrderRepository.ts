import {CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizOrder} from "@/types/entity/BizOrder";
import {RevenueTrendsItemResp} from "@/types/ReportType";

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

    async getTodayRevenue(merchantId: string): Promise<number> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfDay = today.getTime();
        const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

        const {data, error} = await supabase
            .from('biz_order')
            .select('total_amount,service_fee')
            .eq("status", 1)
            .eq("merchant_id", merchantId)
            .gte('create_time', startOfDay)
            .lte('create_time', endOfDay);

        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.reduce((sum, order) => {
            return sum + (order.total_amount || 0) - (order.service_fee || 0);
        }, 0) || 0;
    }

    async getRevenueTrends(merchantId: string): Promise<RevenueTrendsItemResp[]> {
        const {data, error} = await supabase
            .from('biz_order')
            .select('create_time,total_amount,service_fee')
            .eq('status', 1)
            .eq('merchant_id', merchantId);

        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }

        if (!data || data.length === 0) {
            return [];
        }
        const monthlyData = new Map<string, number>();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        data.forEach(order => {
            if (order.create_time) {
                const date = new Date(order.create_time);
                const monthKey = monthNames[date.getMonth()];
                const netAmount = (order.total_amount || 0) - (order.service_fee || 0);
                if (monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, monthlyData.get(monthKey)! + netAmount);
                } else {
                    monthlyData.set(monthKey, netAmount);
                }
            }
        });
        return Array.from(monthlyData.entries()).map(([date, revenue]) => ({
            date,
            revenue
        }));
    }
}