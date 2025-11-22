import {CommonError, CommonErrorEnum, Inject, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {BusinessService} from "@/service/BusinessService";
import {
    BusinessAddReq, BusinessDeleteReq, BusinessListReq, BusinessListResp,
    BusinessUpdateReq
} from "@/types/BusinessType";
import {BusinessRepository} from "@/repository/BusinessRepository";
import {MerchantUserRpcService} from "@/rpc/MerchantUserRpcService";
import {MERCHANT_USER_API} from "@/config/RpcRegistry";
import {BizBusiness} from "@/types/entity/BizBusiness";

@Service()
export class BusinessServiceImpl implements BusinessService {
    constructor(@Inject() private businessRepository: BusinessRepository,
                @Inject(MERCHANT_USER_API) private merchantUserRpcService: MerchantUserRpcService) {
    }

    async addBusiness(req: BusinessAddReq, userId: string): Promise<any> {
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (req.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const now = new Date().getTime();
        const insertData: BizBusiness = {
            id: SnowflakeUtil.generateId(),
            ...req,
            businessHours: req.businessHours ? JSON.stringify(req.businessHours) : "",
            createTime: now,
            updateTime: now,
        };
        await this.businessRepository.insert(insertData);
    }

    async updateBusiness(req: BusinessUpdateReq, userId: string) {
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (req.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        let record = await this.businessRepository.getOneById(req.id);
        const now = new Date().getTime();
        const updateData: BizBusiness = {
            ...record,
            ...req,
            businessHours: req.businessHours ? JSON.stringify(req.businessHours) : "",
            updateTime: now,
        };
        await this.businessRepository.update(updateData);
    }

    async deleteBusiness(req: BusinessDeleteReq, userId: string) {
        let record = await this.businessRepository.getOneById(req.id);
        if (!record) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND);
        }
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId)
        if (req.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        await this.businessRepository.deleteById(req.id);
    }

    async getList(req: BusinessListReq, userId: string): Promise<BusinessListResp[]> {
        const merchantId = await this.merchantUserRpcService.getMerchantIdByUserId(userId);
        if (req.merchantId != merchantId) {
            throw new CommonError(CommonErrorEnum.PERMISSION_DENIED);
        }
        const data = await this.businessRepository.getList(req.merchantId);
        return data.map(item => {
            return {
                id: item.id,
                name: item.name,
                logoUrl: item.logoUrl,
                website: item.website,
                location: item.location,
                rooms: item.rooms,
                chairs: item.chairs,
                description: item.description,
                businessHours: item.businessHours ? JSON.parse(item.businessHours) : {},
            }
        })
    }
}
