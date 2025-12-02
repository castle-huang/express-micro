import {CommonError, CommonErrorEnum, Inject, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {BusinessService} from "@/service/BusinessService";
import {BusinessAddReq, BusinessUpdateReq} from "@/types/BusinessType";
import {supabase} from "@/config/Supabase";
import {v4 as uuidv4} from 'uuid';
import {StaffService} from "@/service/StaffService";
import {
    StaffAddReq,
    StaffDeleteReq,
    StaffDropdownReq, StaffDropdownResp,
    StaffListItemResp,
    StaffListReq,
    StaffUpdateReq
} from "@/types/StaffType";
import {StaffRepository} from "@/repository/StaffRepository";
import {BizStaff} from "@/types/entity/BizStaff";
import {it} from "node:test";
import {BusinessRepository} from "@/repository/BusinessRepository";
import {ServiceDropdownReq, ServiceDropdownResp} from "@/types/ServiceType";
import {BizService} from "@/types/entity/BizService";

@Service()
export class StaffServiceImpl implements StaffService {
    constructor(@Inject() private staffRepository: StaffRepository
        , @Inject() private businessRepository: BusinessRepository) {
    }

    async addStaff(req: StaffAddReq): Promise<any> {
        const now = new Date().getTime()
        const bizStaff: BizStaff = {
            id: SnowflakeUtil.generateId(),
            createTime: now,
            updateTime: now,
            ...req,
        };
        bizStaff.fullPhone = `(${req.phoneCode})${req.phone}`
        await this.staffRepository.insert(bizStaff);
    }

    async updateStaff(req: StaffUpdateReq): Promise<any> {
        const staff = await this.staffRepository.getOneById(req.id);
        if (!staff || staff.deleted) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR, "staff not found")
        }
        await this.staffRepository.update({
            ...staff,
            ...req,
            updateTime: new Date().getTime(),
        });
    }

    async getStaffList(req: StaffListReq): Promise<StaffListItemResp[]> {
        const data: BizStaff[] = await this.staffRepository.getList(req);
        let list: StaffListItemResp[] = [];
        for (let item of data) {
            const business = await this.businessRepository.getOneById(item?.businessId || "");
            list.push({
                id: item.id,
                businessId: item.businessId,
                businessName: business?.name,
                name: item.name,
                email: item.email,
                fullPhone: item.fullPhone,
                merchantId: item.merchantId,
            });
        }
        return list;
    }

    async deleteStaff(req: StaffDeleteReq): Promise<void> {
        let record = await this.staffRepository.getOneById(req.id);
        if (!record) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND);
        }
        await this.staffRepository.deleteById(req.id);
    }

    async getDropdownList(req: StaffDropdownReq): Promise<StaffDropdownResp[]> {
        const data: BizStaff[] = await this.staffRepository.getDropdownList(req);
        return data.map(service => {
            return {
                id: service.id,
                name: service.name
            }
        })
    }
}
