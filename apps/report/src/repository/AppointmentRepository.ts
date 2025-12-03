import {CommonError, snakeToCamel, Service, CommonErrorEnum, camelToSnake, Inject} from "@sojo-micro/rpc";
import {supabase} from "@/config/Supabase";
import {BizAppointment} from "@/types/entity/BizAppointment";
import {AppointmentItemResp, BookingsServiceItemResp} from "@/types/ReportType";
import {StaffRepository} from "@/repository/StaffRepository";
import {ServiceRepository} from "@/repository/ServiceRepository";

@Service()
export class AppointmentRepository {
    constructor(@Inject() private staffRepository: StaffRepository,
                @Inject() private serviceRepository: ServiceRepository,) {
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

    private mapToList(records: any[]): BizAppointment[] {
        if (!records || !Array.isArray(records)) {
            return [];
        }
        return records
            .filter(record => record != null)
            .map(record => snakeToCamel(record))
            .filter((business): business is BizAppointment => business !== null);
    }

    async getTotalAppointment(merchantId: string) {
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('id')
            .eq('merchant_id', merchantId);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        return data?.length || 0;
    }

    async getNewCustomers(merchantId: string) {
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('customer_user_id')
            .eq('merchant_id', merchantId);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        if (!data) return 0;
        const uniqueCustomers = new Set(
            data
                .filter(item => item.customer_user_id != null)
                .map(item => item.customer_user_id)
        );
        return uniqueCustomers.size;
    }

    async getRecentBookedAppointments(merchantId: string): Promise<AppointmentItemResp[]> {
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('*')
            .eq('merchant_id', merchantId)
            .order('create_time', {ascending: false})
            .limit(5);
        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        if (!data || data.length === 0) {
            return [];
        }
        const results: AppointmentItemResp[] = [];
        for (const item of data) {
            let serviceName: string | undefined;
            let staffName: string | undefined;
            if (item.service_id) {
                const service = await this.serviceRepository.getOneById(item.service_id);
                serviceName = service?.name;
            }
            if (item.staff_id) {
                const staff = await this.staffRepository.getOneById(item.staff_id);
                staffName = staff?.name;
            }
            results.push({
                id: item.id,
                customerName: item.customer_name,
                serviceName: serviceName,
                staffName: staffName,
                appointmentTime: item.appointment_time,
                bookedAt: item.create_time
            });
        }

        return results;
    }

    async getBookingsService(merchantId: string): Promise<BookingsServiceItemResp[]> {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('service_id')
            .eq('merchant_id', merchantId)
            .gte('create_time', startOfMonth)
            .lte('create_time', endOfMonth);

        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }
        if (!data || data.length === 0) {
            return [];
        }
        const serviceCountMap = new Map<string, number>();
        data.forEach(appointment => {
            if (appointment.service_id) {
                const currentCount = serviceCountMap.get(appointment.service_id) || 0;
                serviceCountMap.set(appointment.service_id, currentCount + 1);
            }
        });

        const results: BookingsServiceItemResp[] = [];
        for (const [serviceId, count] of serviceCountMap.entries()) {
            const service = await this.serviceRepository.getOneById(serviceId);
            results.push({
                serviceName: service?.name,
                bookings: count
            });
        }
        return results;
    }

    async getLastMothBookingsPerNum(merchantId: string) {
        const now = new Date();
        const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfLastMonth = new Date(firstDayOfCurrentMonth.getTime() - 1);
        const firstDayOfLastMonth = new Date(lastDayOfLastMonth.getFullYear(), lastDayOfLastMonth.getMonth(), 1);

        const startOfLastMonth = firstDayOfLastMonth.getTime();
        const endOfLastMonth = lastDayOfLastMonth.getTime();
        const {data, error} = await supabase
            .from('biz_appointment')
            .select('customer_user_id')
            .eq('merchant_id', merchantId)
            .gte('create_time', startOfLastMonth)
            .lte('create_time', endOfLastMonth);

        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }

        if (!data || data.length === 0) {
            return 0;
        }
        const uniqueCustomers = new Set(
            data
                .filter(item => item.customer_user_id != null)
                .map(item => item.customer_user_id)
        );

        return uniqueCustomers.size;
    }

    async currentMonthBookingsPerNum(merchantId: string) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        const {data, error} = await supabase
            .from('biz_appointment')
            .select('customer_user_id')
            .eq('merchant_id', merchantId)
            .gte('create_time', startOfMonth)
            .lte('create_time', endOfMonth);

        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }

        if (!data || data.length === 0) {
            return 0;
        }

        const uniqueCustomers = new Set(
            data
                .filter(item => item.customer_user_id != null)
                .map(item => item.customer_user_id)
        );

        return uniqueCustomers.size;
    }

    async getCurrentFirstBookingPerNum(merchantId: string) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        const {data, error} = await supabase
            .from('biz_appointment')
            .select('customer_user_id,create_time')
            .eq('merchant_id', merchantId)
            .gte('create_time', startOfMonth)
            .lte('create_time', endOfMonth);

        if (error) {
            throw new CommonError(CommonErrorEnum.SYSTEM_EXCEPTION);
        }

        if (!data || data.length === 0) {
            return 0;
        }

        const firstBookingMap = new Map<string, number>();
        data.forEach(appointment => {
            if (appointment.customer_user_id) {
                const currentTime = appointment.create_time || 0;
                const existingTime = firstBookingMap.get(appointment.customer_user_id) || Infinity;
                if (currentTime < existingTime) {
                    firstBookingMap.set(appointment.customer_user_id, currentTime);
                }
            }
        });
        return firstBookingMap.size;
    }
}