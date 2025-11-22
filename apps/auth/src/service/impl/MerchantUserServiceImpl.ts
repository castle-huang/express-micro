import {MerchantUserService} from '@/service/MerchantUserService';
import {
    AuthenticatedRequest,
    CommonError,
    CommonErrorEnum,
    Inject,
    JWTUtils,
    Service,
    SnowflakeUtil
} from "@sojo-micro/rpc";
import {MerchantUserRepository} from "../../repository/MerchantUserRepository";
import {MerchantRepository} from "../../repository/MerchantRepository";
import {LoginReq, LoginResp, ProfilesResp, RegisterReq, SignUpResp, UpdateMerchantUserReq} from "../../types/AuthType";
import {AuthErrorEnum} from "../../types/AuthErrorEnum";
import {MerchantUserType} from "../../types/MerchantUserType";

@Service()
export class MerchantUserServiceImpl implements MerchantUserService {

    constructor(@Inject() private merchantUserRepository: MerchantUserRepository,
                @Inject() private merchantRepository: MerchantRepository) {
    }

    /**
     * Register
     */
    async register(req: RegisterReq): Promise<SignUpResp> {
        this.validateSignUpRequest(req.fullName, req.email, req.password);
        const merchantUser = await this.merchantUserRepository.findByEmail(req.email);
        if (merchantUser) {
            throw new CommonError(AuthErrorEnum.EMAIL_ALREADY_USED);
        }
        // create new merchant
        const merchantId = SnowflakeUtil.generateBigString();
        await this.merchantRepository.insert({
            id: merchantId,
            name: '',
        })
        // create new merchant user
        const userId = SnowflakeUtil.generateBigString();
        await this.merchantUserRepository.insert({
            id: userId,
            fullName: req.fullName,
            email: req.email,
            password: req.password,
            type: MerchantUserType.OWNER,
            merchantId: merchantId,
            updateTime: new Date().getTime(),
            createTime: new Date().getTime()
        });

        const payload: AuthenticatedRequest = {
            user: {
                id: userId,
                merchantId: merchantId,
            }
        } as AuthenticatedRequest;
        const token = JWTUtils.generateToken(payload);
        return {
            token: token
        };
    }

    /**
     * Login
     */
    async login(req: LoginReq): Promise<LoginResp> {
        this.validateLoginRequest(req.email, req.password);
        const merchantUser = await this.merchantUserRepository.findByEmail(req.email);
        if (!merchantUser || merchantUser.password !== req.password) {
            throw new CommonError(AuthErrorEnum.LOGIN_FAILED)
        }
        const payload: AuthenticatedRequest = {
            user: {
                id: merchantUser.id,
                merchantId: merchantUser.merchantId
            }
        } as AuthenticatedRequest;
        const token = JWTUtils.generateToken(payload);
        return {
            token: token,
        }
    }

    async getMerchantUser(userId: string): Promise<ProfilesResp> {
        const merchantUser = await this.merchantUserRepository.findById(userId);
        if (!merchantUser) {
            throw new CommonError(AuthErrorEnum.USER_NOT_EXISTS);
        }
        return {
            avatarUrl: merchantUser?.avatarUrl || '',
            fullName: merchantUser?.fullName || '',
            phoneCode: merchantUser?.phoneCode || '',
            phone: merchantUser?.phone || '',
            fullPhone: merchantUser?.fullPhone || '',
            email: merchantUser?.email || '',
        };
    }

    async updateMerchantUser(req: UpdateMerchantUserReq): Promise<void> {
        const merchantUser = await this.merchantUserRepository.findById(req.id);
        if (!merchantUser) {
            throw new CommonError(AuthErrorEnum.USER_NOT_EXISTS);
        }
        await this.merchantUserRepository.updateById({
            id: req.id,
            fullName: req.fullName,
            avatarUrl: req.avatarUrl,
            phoneCode: req.phoneCode,
            phone: req.phone,
            fullPhone: req.phoneCode && req.phone,
            updateTime: new Date().getTime()
        });
    }

    private validateLoginRequest(email: string, password: string) {
        if (!email || !password) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
    }

    private validateSignUpRequest(fullName: string, email: string, password: string) {
        if (!fullName || !email || !password) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
    }
}
