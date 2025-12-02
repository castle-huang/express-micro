import {CommonError, CommonErrorEnum, Inject, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {AppointmentService} from "@/service/AppointmentService";
import {
    AppointmentItemResp,
    AppointmentReq,
    AppointmentSearchReq,
    AppointmentUserItemResp
} from "@/types/AppointmentType";
import {AppointmentRepository} from "@/repository/AppointmentRepository";
import {BizAppointment} from "@/types/entity/BizAppointment";
import {MERCHANT_USER_API} from "@/config/RpcRegistry";
import {MerchantUserRpcService} from "@/rpc/MerchantUserRpcService";
import {StaffRepository} from "@/repository/StaffRepository";
import {BusinessRepository} from "@/repository/BusinessRepository";
import {ServiceRepository} from "@/repository/ServiceRepository";

@Service()
export class AppointmentServiceImpl implements AppointmentService {
    constructor(@Inject() private appointmentRepository: AppointmentRepository,
                @Inject(MERCHANT_USER_API) private merchantUserRpcService: MerchantUserRpcService,
                @Inject() private staffRepository: StaffRepository,
                @Inject() private businessRepository: BusinessRepository,
                @Inject() private serviceRepository: ServiceRepository
    ) {
    }

    async addAppointment(req: AppointmentReq, userId: string): Promise<void> {
        const {businessId, serviceId, staffId, customerName, timeSlot, appointmentTime} = req;
        if (!businessId || !serviceId || !staffId || !customerName || !timeSlot || !appointmentTime) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "parameter is error")
        }
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        //check business
        const business = await this.businessRepository.getOneById(businessId);
        if (!business) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "business is not found");
        }
        //check business merchantId
        if (business.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "businessId is error");
        }
        //check staff
        const staff = await this.staffRepository.getOneById(req.staffId);
        if (!staff) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "staffId is not found");
        }
        //check staff merchantId
        if (staff.merchantId != business.merchantId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "staffId is error");
        }
        //check service
        const service = await this.serviceRepository.getOneById(serviceId);
        if (!service) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "serviceId is not found");
        }
        //check service businessId
        if (service.businessId != businessId) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "serviceId is error");
        }
        const bizAppointment = new BizAppointment();
        Object.assign(bizAppointment, req);
        bizAppointment.merchantId = merchantId;
        const now = new Date().getTime();
        bizAppointment.id = SnowflakeUtil.generateId();
        bizAppointment.createTime = now;
        bizAppointment.updateTime = now;
        await this.appointmentRepository.insert(bizAppointment);
    }

    async searchAppointment(req: AppointmentSearchReq, userId: string): Promise<AppointmentItemResp[]> {
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const {appointmentStartTime, appointmentEndTime} = req;
        if (!appointmentStartTime || !appointmentEndTime) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "parameter is error")
        }
        const list = await this.appointmentRepository.searchList(req, merchantId);
        return list.map(item => {
            return item;
        });
    }

    async getUserAppointmentList(customerUserId: string): Promise<AppointmentUserItemResp[]> {
        const list = await this.appointmentRepository.getAppointmentListByCustomerUserId(customerUserId);
        let resList = [];
        for (let bizAppointment of list) {
            const staff = await this.staffRepository.getOneById(bizAppointment.staffId ?? "");
            const service = await this.serviceRepository.getOneById(bizAppointment.serviceId ?? "");
            let app: AppointmentUserItemResp = {
                id: bizAppointment.id,
                staffId: bizAppointment.staffId,
                staffName: staff?.name,
                serviceId: bizAppointment.serviceId,
                serverName: service?.name,
                customerName: bizAppointment.customerName,
                appointmentTime: bizAppointment.appointmentTime,
                timeSlot: bizAppointment.timeSlot
            }
            resList.push(app);
        }
        return resList;
    }
}