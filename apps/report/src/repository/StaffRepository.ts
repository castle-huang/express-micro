import {CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizStaff} from "@/types/entity/BizStaff";

@Service()
export class StaffRepository {
    async getOneById(id: string): Promise<BizStaff> {
        const {data, error} = await supabase
            .from('biz_staff')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }
}