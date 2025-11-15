import {MerchantUser} from "../types/entity/MerchantUser";
import {supabase} from "../config/Supabase";
import {Service} from "@sojo-micro/rpc";

@Service()
export class MerchantUserDao {
    async findByEmail(email: string): Promise<MerchantUser | null> {
        const { data } = await supabase
            .from('merchant_user')
            .select('*')
            .eq('email', email)
            .single();
        return data;
    }

    async insert(user: Partial<MerchantUser>): Promise<MerchantUser | null> {
        const { data, error } = await supabase
            .from('merchant_user')
            .insert([user])
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data;
    }
}