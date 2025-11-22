import {AuthMerchantUser} from "@/types/entity/AuthMerchantUser";
import {supabase} from "@/config/Supabase";
import {Service, camelToSnake, snakeToCamel} from "@sojo-micro/rpc";


@Service()
export class MerchantUserRepository {

    async findByEmail(email: string): Promise<AuthMerchantUser | null> {
        const { data } = await supabase
            .from('auth_merchant_user')
            .select('*')
            .eq('email', email)
            .eq('deleted', false)
            .single();
        return this.mapToMerchantUser(data);
    }

    async findById(userId: string) : Promise<AuthMerchantUser | null> {
        const { data } = await supabase
            .from('auth_merchant_user')
            .select('*')
            .eq('id', userId)
            .eq('deleted', false)
            .single();
        return this.mapToMerchantUser(data);
    }

    async insert(user: Partial<AuthMerchantUser>): Promise<AuthMerchantUser | null> {
        const { data, error } = await supabase
            .from('auth_merchant_user')
            .insert([camelToSnake(user)])
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    }

    async updateById(user: Partial<AuthMerchantUser>): Promise<AuthMerchantUser | null> {
        const { data, error } = await supabase
            .from('auth_merchant_user')
            .update(camelToSnake(user))
            .eq('id', user.id);
        if (error) {
            throw error;
        }
        return data;
    }

    private mapToMerchantUser(record: any): AuthMerchantUser | null {
        if (!record) return null;
        return {
            id: record.id,
            merchantId: record.merchant_id,
            avatarUrl: record.avatar_url,
            email: record.email,
            fullName: record.full_name,
            phoneCode: record.phone_code,
            phone: record.phone,
            fullPhone: record.full_phone,
            updateTime: record.update_time,
            createTime: record.create_time,
            password: record.password
        };
    }
}