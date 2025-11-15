import {MerchantUser} from "../types/entity/MerchantUser";
import {supabase} from "../config/Supabase";
import {Service} from "@sojo-micro/rpc";

@Service()
export class MerchantUserRepository {
    async findByEmail(email: string): Promise<MerchantUser | null> {
        const { data } = await supabase
            .from('merchant_user')
            .select('id')
            .eq('email', email)
            .single();
        return this.mapToMerchantUser(data);
    }

    async findById(userId: string) : Promise<MerchantUser | null> {
        const { data } = await supabase
            .from('merchant_user')
            .select('*')
            .eq('id', userId)
            .single();
        return this.mapToMerchantUser(data);
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

    private mapToMerchantUser(record: any): MerchantUser | null {
        if (!record) return null;
        return {
            id: record.id,
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