import {CommonError, CommonErrorEnum, Inject, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {ServiceService} from "@/service/ServiceService";
import {ServiceTypeRepository} from "@/repository/ServiceTypeRepository";
import {
    ServiceAddReq,
    ServiceSearchReq,
    ServiceSearchItemResp,
    ServiceTypeItemResp
} from "@/types/ServiceType";
import {ServiceRepository} from "@/repository/ServiceRepository";
import {BizService} from "@/types/entity/BizService";
import {MERCHANT_USER_API} from "@/config/RpcRegistry";
import {MerchantUserRpcService} from "@/rpc/MerchantUserRpcService";

@Service()
export class ServiceServiceImpl implements ServiceService {
    constructor(@Inject() private serviceTypeRepository: ServiceTypeRepository,
                @Inject() private serviceRepository: ServiceRepository,
                @Inject(MERCHANT_USER_API) private merchantUserRpcService: MerchantUserRpcService) {
    }

    async getTypeList(): Promise<ServiceTypeItemResp[]> {
        let serviceTypes = await this.serviceTypeRepository.getList();
        return serviceTypes.map(serviceType => {
            return {
                id: serviceType.id,
                name: serviceType.name
            }
        })
    }

    async addService(req: ServiceAddReq, userId: string): Promise<void> {
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const now = new Date().getTime();
        const bizService = {
            id: SnowflakeUtil.generateId(),
            merchantId: merchantId,
            businessId: req.businessId,
            name: req.name,
            serviceTypeId: req.serviceTypeId,
            duration: req.duration,
            price: req.price,
            currency: req.currency,
            chairs: req.chairs,
            rooms: req.rooms,
            description: req.description,
            isActive: true,
            updateTime: now,
            createTime: now
        } as BizService;
        await this.serviceRepository.insert(bizService);
    }

    async getList(req: ServiceSearchReq, userId: string): Promise<ServiceSearchItemResp[]> {
        //check merchantId
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (!merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const data: BizService[] = await this.serviceRepository.getList(req, merchantId);
        return data.map(service => {
            return {
                id: service.id,
                name: service.name,
                duration: service.duration,
                price: service.price,
                currency: service.currency,
                chairs: service.chairs,
                rooms: service.rooms,
                description: service.description,
                isActive: service.isActive
            }
        })
    }

}
