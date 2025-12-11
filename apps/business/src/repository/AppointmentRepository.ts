import {CommonError, snakeToCamel, Service, CommonErrorEnum, camelToSnake} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizAppointment} from "@/types/entity/BizAppointment";
import {AppointmentSearchReq} from "@/types/AppointmentType";
import {BizStaff} from "@/types/entity/BizStaff";

@Service()
export class AppointmentRepository {

    async getOneById(id: string): Promise<BizAppointment> {
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('*')
            .eq('id', id)
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return snakeToCamel(data);
    }
    async getList(userId: string): Promise<BizAppointment[] | null> {
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('*')
            .eq('owner_id', userId);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        if (!data || data.length === 0) {
            return [];
        }
        return this.mapToList(data);
    }

    async insert(appointment: Partial<BizAppointment>): Promise<void> {
        const {error} = await supabase
            .from('biz_appointment')
            .insert(camelToSnake(appointment))
            .maybeSingle();
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    async update(appointment: BizAppointment) {
        const {error} = await supabase
            .from('biz_appointment')
            .update(camelToSnake(appointment))
            .eq('id', appointment.id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }

    private mapToList(records: any[]): BizAppointment[] {
        if (!records || !Array.isArray(records)) {
            return [];
        }
        return records
            .filter(record => record != null)
            .map(record => snakeToCamel(record))
            .filter((business): business is BizAppointment => business !== null);
    }

    async searchList(req: AppointmentSearchReq, merchantId: string): Promise<BizAppointment[]> {
        let query = supabase
            .from('biz_appointment')
            .select('*')
            .eq('merchant_id', merchantId);
        // add required query
        if (req.appointmentStartTime) {
            query = query.gte('appointment_time', req.appointmentStartTime);
        }
        if (req.appointmentEndTime) {
            query = query.lte('appointment_time', req.appointmentEndTime);
        }

        // add optional query
        if (req.businessId) {
            query = query.eq('business_id', req.businessId);
        }
        if (req.staffId) {
            query = query.eq('staff_id', req.staffId);
        }
        if (req.serviceId) {
            query = query.eq('service_id', req.serviceId);
        }
        const {data, error} = await query;
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return this.mapToList(data);
    }

    async getAppointmentListByCustomerUserId(customerUserId: string): Promise<BizAppointment[]> {
        let {data, error} = await supabase
            .from('biz_appointment')
            .select('*')
            .eq('customer_user_id', customerUserId);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        if (!data || data.length === 0) {
            return [];
        }
        return this.mapToList(data);
    }

    async deleteById(id: string): Promise<void> {
        const {error} = await supabase
            .from('biz_appointment')
            .delete()
            .eq('id', id);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
    }
}