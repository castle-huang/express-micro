import {camelToSnake, CommonError, CommonErrorEnum, Service, snakeToCamel} from "@sojo-micro/rpc";
import {PayStripeAccount} from "@/types/entity/PayStripeAccount";
import {supabase} from "@/config/Supabase";

@Service()
export class PayStripeAccountRepository {
    async getOneById(id: string): Promise<PayStripeAccount> {
        const {data, error} = await supabase
            .from('pay_stripe_account')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }

    async getOneByMerchantId(merchantId: string): Promise<PayStripeAccount> {
        const {data, error} = await supabase
            .from('pay_stripe_account')
            .select('*')
            .eq('merchant_id', merchantId)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }

    async insert(payStripeAccount: PayStripeAccount) {
        const {error} = await supabase
            .from('pay_stripe_account')
            .insert(camelToSnake(payStripeAccount));
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async update(payStripeAccount: PayStripeAccount): Promise<void> {
        const {error} = await supabase
            .from('pay_stripe_account')
            .update(camelToSnake(payStripeAccount))
            .eq('id', payStripeAccount.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }
}