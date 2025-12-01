import {camelToSnake, CommonError, CommonErrorEnum, Inject, JWTUtils, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {OrderService} from "@/service/OrderService";
import {OrderSearchReq, OrderItemResp, OrderReq, OrderResp} from "@/types/OrderType";
import {OrderRepository} from "@/repository/OrderRepository";
import {MERCHANT_USER_API} from "@/config/RpcRegistry";
import {MerchantUserRpcService} from "@/rpc/MerchantUserRpcService";
import {ServiceRepository} from "@/repository/ServiceRepository";
import {AppointmentRepository} from "@/repository/AppointmentRepository";
import {BizAppointment} from "@/types/entity/BizAppointment";
import {StaffRepository} from "@/repository/StaffRepository";
import {BizOrder} from "@/types/entity/BizOrder";
import {BusinessRepository} from "@/repository/BusinessRepository";
import {OrderItemRepository} from "@/repository/OrderItemRepository";
import {BizOrderItem} from "@/types/entity/BizOrderItem";

@Service()
export class OrderServiceImpl implements OrderService {
    constructor(@Inject(MERCHANT_USER_API) private merchantUserRpcService: MerchantUserRpcService,
                @Inject() private orderRepository: OrderRepository,
                @Inject() private serviceRepository: ServiceRepository,
                @Inject() private appointmentRepository: AppointmentRepository,
                @Inject() private staffRepository: StaffRepository,
                @Inject() private businessRepository: BusinessRepository,
                @Inject() private orderItemRepository: OrderItemRepository
    ) {
    }

    async searchList(req: OrderSearchReq, userId: string): Promise<OrderItemResp[]> {
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const list = await this.orderRepository.searchList(req, merchantId);
        // return list.map(item => {
        //     return item;
        // });
        return []
    }

    async addOrder(req: OrderReq, userId: string): Promise<OrderResp> {
        const {businessId, appointmentTime, services, email, phone, fullName, timeSlot} = req;
        if (!businessId || !appointmentTime || !services || services.length === 0 || !fullName || !email || !phone || !timeSlot) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
        let business = await this.businessRepository.getOneById(businessId);
        if (!business) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "business is not found");
        }
        const now = new Date().getTime();
        const orderId = SnowflakeUtil.generateId();
        let bizOrderItemList: BizOrderItem[] = []
        for (let serviceInfo of services) {
            if (!serviceInfo.serviceId || !serviceInfo.count) {
                throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
            }
            const service = await this.serviceRepository.getOneById(serviceInfo.serviceId);
            if (!service) {
                throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "service is not found");
            }
            if (!service.businessId || service.businessId != businessId) {
                throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "businessId is error");
            }
            if (!service.price) {
                throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "service price is not found");
            }
            const staffs = await this.staffRepository.getStaffListByServiceId(service.businessId);
            if (!staffs || staffs.length === 0) {
                throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "staff is not found");
            }
            const staff = staffs[Math.floor(Math.random() * staffs.length)];
            const bizOrderItem: BizOrderItem = {
                id: SnowflakeUtil.generateId(),
                merchantId: staff.merchantId,
                businessId: service.businessId,
                serviceId: service.id,
                serviceName: service.name,
                orderId: orderId,
                staffId: staff.id,
                staffName: staff.name,
                price: service.price,
                count: serviceInfo.count,
                amount: parseFloat((service.price * serviceInfo.count).toFixed(2)),
                customerName: fullName,
                userId: userId,
                updateTime: now,
                createTime: now
            };
            bizOrderItemList.push(bizOrderItem);
        }
        let totalAmount = 0;
        for (let bizOrderItem of bizOrderItemList) {
            const bizAppointment: BizAppointment = {
                id: SnowflakeUtil.generateId(),
                merchantId: bizOrderItem.merchantId,
                businessId: bizOrderItem.businessId,
                staffId: bizOrderItem.staffId,
                serviceId: bizOrderItem.serviceId,
                customerName: fullName,
                email: email,
                phone: phone,
                orderId: bizOrderItem.orderId,
                appointmentTime: appointmentTime,
                timeSlot: timeSlot,
                createTime: now,
                updateTime: now
            };
            await this.appointmentRepository.insert(bizAppointment);
            bizOrderItem.appointmentId = bizAppointment.id;
            await this.orderItemRepository.insert(bizOrderItem);
            totalAmount += bizOrderItem.amount;
        }
        const bizOrder: BizOrder = {
            id: orderId,
            merchantId: business.merchantId,
            businessId: business.id,
            email: email,
            phone: phone,
            customerName: fullName,
            userId: userId,
            totalAmount: totalAmount,
            createTime: now,
            updateTime: now
        }
        await this.orderRepository.insert(bizOrder);
        return {
            orderId: orderId
        }
    }

}