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
import {
    CustomerResetPasswordReq,
    CustomerUpdatePasswordReq,
    CustomerVerifyCodeReq,
    CustomerVerifyResetPwdCodeResp
} from "@/types/AuthCustomerType";
import {CacheDataRepository} from "@/repository/CacheDataRepository";
import {SysCacheData} from "@/types/entity/SysCacheData";
import {EmailService} from "@/service/EmailService";

@Service()
export class MerchantUserServiceImpl implements MerchantUserService {

    constructor(@Inject() private merchantUserRepository: MerchantUserRepository,
                @Inject() private merchantRepository: MerchantRepository,
                @Inject() private cacheDataRepository: CacheDataRepository,
                @Inject() private emailService: EmailService) {
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
        const now = new Date().getTime();
        await this.merchantUserRepository.insert({
            id: userId,
            fullName: req.fullName,
            email: req.email,
            password: req.password,
            type: MerchantUserType.OWNER,
            merchantId: merchantId,
            updateTime: now,
            createTime: now
        });

        const payload: AuthenticatedRequest = {
            user: {
                id: userId,
                merchantId: merchantId,
            }
        } as AuthenticatedRequest;
        const {accessToken, refreshToken} = JWTUtils.generateToken(payload);
        return {
            token: accessToken,
            refreshToken
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
        const {accessToken, refreshToken} = JWTUtils.generateToken(payload);
        return {
            token: accessToken,
            refreshToken
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

    async updatePassword(req: CustomerUpdatePasswordReq): Promise<void> {
        if (!req.oldPassword || !req.newPassword) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
        const merchantUser = await this.merchantUserRepository.findById(req.id);
        if (!merchantUser) {
            throw new CommonError(AuthErrorEnum.USER_NOT_EXISTS);
        }
        if (req.oldPassword !== merchantUser.password) {
            throw new CommonError(AuthErrorEnum.WRONG_OLD_PASSWORD);
        }
        await this.merchantUserRepository.updateById({
            id: req.id,
            password: req.newPassword,
            updateTime: new Date().getTime()
        });
    }

    async sendResetPwdEmail(userId: string): Promise<Boolean> {
        const customerUser = await this.merchantUserRepository.findById(userId);
        if (!customerUser) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND);
        }
        const code = this.generateRandomNumber(6);
        const cacheKey = 'merchant_reset_password_code' + ":" + userId;
        await this.saveCacheData(cacheKey, code);
        if (customerUser.email) {
            const sendResult = await this.emailService.sendTextEmail(customerUser.email, 'Reset password', code);
            return  sendResult.success;
        }
        return false;
    }

    async verifyResetPwdCode(req: CustomerVerifyCodeReq): Promise<CustomerVerifyResetPwdCodeResp> {
        if (!req.code) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
        const cacheKey = 'merchant_reset_password_code' + ":" + req.userId;
        const cacheData = await this.cacheDataRepository.findByKey(cacheKey);
        if (!cacheData || cacheData.cacheValue != req.code) {
            throw new CommonError(CommonErrorEnum.VERIFY_CODE_ERROR);
        }
        const resetToken = this.generateRandoString(8);
        const key = 'merchant_reset_pwd_token' + ":" + req.userId;
        this.saveCacheData(key, resetToken);
        if (cacheData.id) {
            await this.cacheDataRepository.deleteById(cacheData.id);
        }
        return {
            resetPwdToken: resetToken
        };
    }

    async resetPwd(req: CustomerResetPasswordReq): Promise<void> {
        if (!req.resetToken || !req.password) {
            throw new CommonError(CommonErrorEnum.PARAMETER_ERROR);
        }
        const cacheKey = 'merchant_reset_pwd_token' + ":" + req.userId;
        const cacheData = await this.cacheDataRepository.findByKey(cacheKey);
        if (!cacheData || cacheData.cacheValue != req.resetToken) {
            throw new CommonError(AuthErrorEnum.RESET_PASSWORD_ERROR);
        }
        if (cacheData.id) {
            await this.cacheDataRepository.deleteById(cacheData.id);
        }
        await this.merchantUserRepository.updateById({
            id: req.userId,
            password: req.password,
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

    private generateRandomNumber(length: number) {
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }

    private generateRandoString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const bytes = new Uint8Array(length);
        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(bytes);
        }

        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars[bytes[i] % chars.length];
        }
        return result;
    }

    private async saveCacheData(key: string, value: string) {
        const cacheData: Partial<SysCacheData> = {
            id: SnowflakeUtil.generateBigString(),
            cacheKey: key,
            cacheValue: value,
            createTime: new Date().getTime()
        };
        await this.cacheDataRepository.insert(cacheData);
    }
}
