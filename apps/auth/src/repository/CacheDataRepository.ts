import {supabase} from "@/config/Supabase";
import {Service, camelToSnake, snakeToCamel} from "@sojo-micro/rpc";
import {AuthCustomerUser} from "@/types/entity/AuthCustomerUser";
import {SysCacheData} from "@/types/entity/SysCacheData";


@Service()
export class CacheDataRepository {

    async findByKey(cacheKey: string): Promise<SysCacheData | null> {
        const { data } = await supabase
            .from('sys_cache_data')
            .select('*')
            .eq('cache_key', cacheKey)
            .maybeSingle();
        return snakeToCamel(data);
    }

    async insert(cacheData: Partial<SysCacheData>): Promise<void> {
        const { data, error } = await supabase
            .from('sys_cache_data')
            .insert([camelToSnake(cacheData)]);

        if (error) {
            throw error;
        }
    }

    async deleteById(id: string): Promise<void> {
        const { data, error } = await supabase
            .from('sys_cache_data')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
    }
}