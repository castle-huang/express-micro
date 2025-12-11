import {camelToSnake, snakeToCamel, CommonError, CommonErrorEnum, Service} from "@sojo-micro/rpc";
import {AuthMerchant} from "@/types/entity/AuthMerchant";
import {supabase} from "@/config/Supabase";

@Service()
export class MerchantRepository {

    async insert(merchant: Partial<AuthMerchant>): Promise<void> {
        const authMerchant = camelToSnake(merchant)
        const { error } = await supabase
            .from('auth_merchant')
            .insert(authMerchant)
            .select()
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION)
        }
    }
    async findById(merchantId: string) : Promise<AuthMerchant> {
        const { data } = await supabase
            .from('auth_merchant')
            .select('*')
            .eq('id', merchantId)
            .maybeSingle();
        return snakeToCamel(data);
    }
}