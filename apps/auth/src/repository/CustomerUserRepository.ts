import {supabase} from "@/config/Supabase";
import {Service, camelToSnake, snakeToCamel} from "@sojo-micro/rpc";
import {AuthCustomerUser} from "@/types/entity/AuthCustomerUser";


@Service()
export class CustomerUserRepository {

    async findByEmail(email: string): Promise<AuthCustomerUser | null> {
        const { data } = await supabase
            .from('auth_customer_user')
            .select('*')
            .eq('email', email)
            .eq('deleted', false)
            .single();
        return snakeToCamel(data);
    }

    async findById(userId: string) : Promise<AuthCustomerUser | null> {
        const { data } = await supabase
            .from('auth_customer_user')
            .select('*')
            .eq('id', userId)
            .eq('deleted', false)
            .single();
        return snakeToCamel(data);
    }

    async insert(user: Partial<AuthCustomerUser>): Promise<AuthCustomerUser | null> {
        const { data, error } = await supabase
            .from('auth_customer_user')
            .insert([camelToSnake(user)])
            .select()
            .single();

        if (error) {
            throw error;
        }
        return data;
    }

    async updateById(user: Partial<AuthCustomerUser>): Promise<AuthCustomerUser | null> {
        const { data, error } = await supabase
            .from('auth_customer_user')
            .update(camelToSnake(user))
            .eq('id', user.id);
        if (error) {
            throw error;
        }
        return data;
    }
}