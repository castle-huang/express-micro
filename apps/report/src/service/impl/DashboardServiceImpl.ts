import {AuthenticatedRequest, Inject, Service} from "@sojo-micro/rpc";
import {DashboardService} from "@/service/DashboardService";
import {DashBoardDetailResp} from "@/types/ReportType";
import {OrderRepository} from "@/repository/OrderRepository";
import {AppointmentRepository} from "@/repository/AppointmentRepository";
import {BusinessRepository} from "@/repository/BusinessRepository";

@Service()
export class DashboardServiceImpl implements DashboardService {
    constructor(@Inject() private orderRepository: OrderRepository,
                @Inject() private appointmentRepository: AppointmentRepository,
                @Inject() private businessRepository: BusinessRepository,
    ) {
    }

    async getDashboard(req: AuthenticatedRequest): Promise<DashBoardDetailResp> {
        const userId = req.user.id;
        const merchantId = req.user.merchantId;
        const changeRevenue = await this.orderRepository.getTodayRevenue(merchantId);
        const totalAppointment = await this.appointmentRepository.getTotalAppointment(merchantId);
        const newCustomers = await this.appointmentRepository.getNewCustomers(merchantId);
        const recentBookedAppointments = await this.appointmentRepository.getRecentBookedAppointments(merchantId);
        const revenueTrends = await this.orderRepository.getRevenueTrends(merchantId);
        const bookingsService = await this.appointmentRepository.getBookingsService(merchantId);
        const lastMonthBookingsPerNum = await this.appointmentRepository.getLastMothBookingsPerNum(merchantId);
        const currentMonthFirstBookingPerNum = await this.appointmentRepository.getCurrentFirstBookingPerNum(merchantId);
        const currentMonthBookingsPerNum = await this.appointmentRepository.currentMonthBookingsPerNum(merchantId);
        let customerRetention = 0;
        if (lastMonthBookingsPerNum > 0) {
            customerRetention = parseFloat(((currentMonthBookingsPerNum - currentMonthFirstBookingPerNum) / lastMonthBookingsPerNum).toFixed(2));
        }
        return {
            changeRevenue: changeRevenue,
            totalAppointment: totalAppointment,
            newCustomers: newCustomers,
            recentBookedAppointments: recentBookedAppointments,
            revenueTrends: revenueTrends,
            bookingsService: bookingsService,
            customerRetention: customerRetention
        };
    }

}