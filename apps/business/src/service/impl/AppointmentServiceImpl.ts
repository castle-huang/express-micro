import {CommonError, CommonErrorEnum, Inject, Service, snakeToCamel, SnowflakeUtil} from "@sojo-micro/rpc";
import {AppointmentService} from "@/service/AppointmentService";
import {
    AppointmentItemResp, AppointmentPageReq, AppointmentPageResp,
    AppointmentReq,
    AppointmentSearchReq, AppointmentUpdateReq,
    AppointmentUserItemResp
} from "@/types/AppointmentType";
import {AppointmentRepository} from "@/repository/AppointmentRepository";
import {BizAppointment} from "@/types/entity/BizAppointment";
import {MERCHANT_USER_API} from "@/config/RpcRegistry";
import {MerchantUserRpcService} from "@/rpc/MerchantUserRpcService";
import {StaffRepository} from "@/repository/StaffRepository";
import {BusinessRepository} from "@/repository/BusinessRepository";
import {ServiceRepository} from "@/repository/ServiceRepository";
import {StaffDeleteReq} from "@/types/StaffType";

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

    async updateAppointment(req: AppointmentUpdateReq): Promise<void> {
        const appointment = await this.appointmentRepository.getOneById(req.id);
        if (!appointment) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND)
        }
        await this.appointmentRepository.update({
            ...appointment,
            ...req,
            updateTime: new Date().getTime(),
        });
    }

    async searchAppointment(req: AppointmentSearchReq, userId: string): Promise<AppointmentItemResp[]> {
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        // const {appointmentStartTime, appointmentEndTime} = req;
        // if (!appointmentStartTime || !appointmentEndTime) {
        //     throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "parameter is error")
        // }
        const list = await this.appointmentRepository.searchList(req, merchantId);
        return list.map(item => {
            return item;
        });
    }

    async getUserAppointmentList(req: AppointmentPageReq): Promise<AppointmentPageResp> {
        const total = await this.appointmentRepository.count(req);
        const list = await this.appointmentRepository.getAppointmentListByCustomerUserId(req);
        let resList = [];
        for (let bizAppointment of list) {
            const business = await this.businessRepository.getOneById(bizAppointment.businessId?? "");
            const staff = await this.staffRepository.getOneByIdIgnoreDeleted(bizAppointment.staffId ?? "");
            const service = await this.serviceRepository.getOneByIdIgnoreDeleted(bizAppointment.serviceId ?? "");
            let app: AppointmentUserItemResp = {
                id: bizAppointment.id,
                staffId: bizAppointment.staffId,
                staffName: staff?.name,
                serviceId: bizAppointment.serviceId,
                serverName: service?.name,
                customerName: bizAppointment.customerName,
                appointmentTime: bizAppointment.appointmentTime,
                timeSlot: bizAppointment.timeSlot,
                imgUrl: business?.logoUrl,
            }
            resList.push(app);
        }
        return {
            list: resList,
            total: total
        }
    }

    async deleteAppointment(id: string): Promise<void> {
        let record = await this.appointmentRepository.getOneById(id);
        if (!record) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND);
        }
        await this.appointmentRepository.deleteById(id);
    }
}