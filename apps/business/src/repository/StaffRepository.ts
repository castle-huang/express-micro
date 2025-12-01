import {camelToSnake, CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizStaff} from "@/types/entity/BizStaff";
import {StaffListReq} from "@/types/StaffType";

@Service()
export class StaffRepository {
    async getOneById(id: string): Promise<BizStaff> {
        const {data, error} = await supabase
            .from('biz_staff')
            .select('*')
            .eq('id', id)
            .single();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }

    async insert(bizStaff: BizStaff) {
        const {error} = await supabase
            .from('biz_staff')
            .insert(camelToSnake(bizStaff))
            .single();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async update(bizStaff: BizStaff) {
        const {error} = await supabase
            .from('biz_staff')
            .update(camelToSnake(bizStaff))
            .eq('id', bizStaff.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async getList(req: StaffListReq): Promise<BizStaff[]> {
        const {merchantId, businessId, name} = req;
        let query = supabase
            .from('biz_staff')
            .select('*')
            .eq('merchant_id', merchantId)
            .order('create_time', {ascending: false});
        if (name) {
            query = query.ilike('name', `%${name}%`);
        }
        if (businessId) {
            query = query.eq('business_id', businessId);
        }
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data.map(item => snakeToCamel(item));
    }

    async getStaffListByServiceId(businessId: string) {
        const {data, error} = await supabase
            .from('biz_staff')
            .select('*')
            .eq('business_id', businessId)
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data.map(item => snakeToCamel(item));
    }
}