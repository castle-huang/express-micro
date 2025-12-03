import {AuthenticatedRequest, Body, Controller, GET, Inject, PermitAll, POST, Req, ResponseUtil} from "@sojo-micro/rpc";
import {DashboardService} from "@/service/DashboardService";

@Controller({basePath: '/api/report/dashboard'})
export class DashboardController {
    constructor(@Inject() private dashboardService: DashboardService,) {
    }

    // @GET()
    // async getDashboard() {
    //     const data = {
    //         changeRevenue: 12.5,
    //         totalAppointment: 42,
    //         customerRetention: 85.3,
    //         newCustomers: 18,
    //         recentBookedAppointments: [
    //             {
    //                 id: "1",
    //                 customerName: "John Smith",
    //                 serviceName: "Haircut",
    //                 staffName: "Michael Johnson",
    //                 appointmentTime: 1700123456789,
    //                 bookedAt: 1699987654321
    //             },
    //             {
    //                 id: "2",
    //                 customerName: "Emily Davis",
    //                 serviceName: "Hair Coloring",
    //                 staffName: "Sarah Wilson",
    //                 appointmentTime: 1700234567890,
    //                 bookedAt: 1700123456789
    //             },
    //             {
    //                 id: "3",
    //                 customerName: "Robert Brown",
    //                 serviceName: "Hair Treatment",
    //                 staffName: "Jennifer Lee",
    //                 appointmentTime: 1700345678901,
    //                 bookedAt: 1700234567890
    //             },
    //             {
    //                 id: "4",
    //                 customerName: "Lisa Miller",
    //                 serviceName: "Perm",
    //                 staffName: "David Taylor",
    //                 appointmentTime: 1700456789012,
    //                 bookedAt: 1700345678901
    //             },
    //             {
    //                 id: "5",
    //                 customerName: "James Wilson",
    //                 serviceName: "Trim",
    //                 staffName: "Amanda Clark",
    //                 appointmentTime: 1700567890123,
    //                 bookedAt: 1700456789012
    //             }
    //         ],
    //         revenueTrends: [
    //             {
    //                 date: "Jan 2024",
    //                 revenue: 12500
    //             },
    //             {
    //                 date: "Feb 2024",
    //                 revenue: 14200
    //             },
    //             {
    //                 date: "Mar 2024",
    //                 revenue: 15800
    //             },
    //             {
    //                 date: "Apr 2024",
    //                 revenue: 13600
    //             },
    //             {
    //                 date: "May 2024",
    //                 revenue: 16800
    //             },
    //             {
    //                 date: "Jun 2024",
    //                 revenue: 14900
    //             },
    //             {
    //                 date: "Jul 2024",
    //                 revenue: 15200
    //             },
    //             {
    //                 date: "Aug 2024",
    //                 revenue: 16100
    //             },
    //             {
    //                 date: "Sep 2024",
    //                 revenue: 14700
    //             },
    //             {
    //                 date: "Oct 2024",
    //                 revenue: 15300
    //             },
    //             {
    //                 date: "Nov 2024",
    //                 revenue: 16900
    //             },
    //             {
    //                 date: "Dec 2024",
    //                 revenue: 18200
    //             }
    //         ],
    //         bookingsService: [
    //             {
    //                 serviceName: "Haircut",
    //                 bookings: 45
    //             },
    //             {
    //                 serviceName: "Hair Coloring",
    //                 bookings: 28
    //             },
    //             {
    //                 serviceName: "Perm",
    //                 bookings: 15
    //             },
    //             {
    //                 serviceName: "Hair Treatment",
    //                 bookings: 32
    //             },
    //             {
    //                 serviceName: "Styling",
    //                 bookings: 22
    //             }
    //         ]
    //     };
    //     return ResponseUtil.success(data);
    // }

    @GET('')
    async getTestDashboard(@Req() req: AuthenticatedRequest) {
        const result = await this.dashboardService.getDashboard(req);
        return ResponseUtil.success(result);
    }
}