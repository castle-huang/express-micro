import {
    AuthenticatedRequest,
    CommonError,
    CommonErrorEnum,
    Inject,
    JWTUtils,
    Service,
    SnowflakeUtil
} from "@sojo-micro/rpc";
import {CustomerUserService} from "@/service/CustomerUserService";
import {
    CustomerResetPasswordReq,
    CustomerUpdatePasswordReq, CustomerVerifyCodeReq, CustomerVerifyResetPwdCodeResp,
    GetCustomerResp,
    LoginCustomerReq,
    LoginCustomerResp,
    RegisterCustomerReq,
    RegisterCustomerResp,
    UpdateCustomerUserReq
} from "@/types/AuthCustomerType";
import {CustomerUserRepository} from "@/repository/CustomerUserRepository";
import {AuthErrorEnum} from "@/types/AuthErrorEnum";
import {EmailService} from "@/service/EmailService";
import {CacheDataRepository} from "@/repository/CacheDataRepository";
import {SysCacheData} from "@/types/entity/SysCacheData";


@Service()
export class CustomerUserServiceImpl implements CustomerUserService {

    constructor(@Inject() private customerUserRepository: CustomerUserRepository,
                @Inject() private emailService: EmailService,
                @Inject() private cacheDataRepository: CacheDataRepository) {
    }

    /**
     * Register
     */
    async register(req: RegisterCustomerReq): Promise<RegisterCustomerResp> {
        this.validateRegisterRequest(req.fullName, req.email, req.password);
        const customerUser = await this.customerUserRepository.findByEmail(req.email);
        if (customerUser) {
            throw new CommonError(AuthErrorEnum.EMAIL_ALREADY_USED);
        }
        const now = new Date().getTime();
        const userId = SnowflakeUtil.generateBigString();
        await this.customerUserRepository.insert({
            id: userId,
            fullName: req.fullName,
            email: req.email,
            password: req.password,
            updateTime: now,
            createTime: now
        });

        // define jwt payload
        const payload: AuthenticatedRequest = {
            user: {
                id: userId
            }
        } as AuthenticatedRequest;

        // generate jwt payload
        const {accessToken, refreshToken} = JWTUtils.generateToken(payload);

        return {token: accessToken, refreshToken};
    }

    /**
     * Login
     */
    async login(req: LoginCustomerReq): Promise<LoginCustomerResp> {

        this.validateLoginRequest(req.email, req.password);

        const customer_user = await this.customerUserRepository.findByEmail(req.email);
        if (!customer_user || customer_user.password !== req.password) {
            throw new CommonError(AuthErrorEnum.LOGIN_FAILED);
        }

        // JWT payload 
        const payload: AuthenticatedRequest = {
            user: {
                id: customer_user.id,
            }
        } as AuthenticatedRequest;

        const {accessToken, refreshToken} = JWTUtils.generateToken(payload);
        return {token: accessToken, refreshToken};
    }

    async getCustomerUser(userId: string): Promise<GetCustomerResp> {
        const merchantUser = await this.customerUserRepository.findById(userId);
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

    async updateCustomerUser(req: UpdateCustomerUserReq): Promise<void> {
        const customerUser = await this.customerUserRepository.findById(req.id);
        if (!customerUser) {
            throw new CommonError(AuthErrorEnum.USER_NOT_EXISTS);
        }
        await this.customerUserRepository.updateById({
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
        const customerUser = await this.customerUserRepository.findById(req.id);
        if (!customerUser) {
            throw new CommonError(AuthErrorEnum.USER_NOT_EXISTS);
        }
        if (req.oldPassword !== customerUser.password) {
            throw new CommonError(AuthErrorEnum.WRONG_OLD_PASSWORD);
        }
        await this.customerUserRepository.updateById({
            id: req.id,
            password: req.newPassword,
            updateTime: new Date().getTime()
        });
    }

    async sendResetPwdEmail(userId: string): Promise<Boolean> {
        const customerUser = await this.customerUserRepository.findById(userId);
        if (!customerUser) {
            throw new CommonError(CommonErrorEnum.DATA_NOT_FOUND);
        }
        const code = this.generateRandomNumber(6);
        const cacheKey = 'customer_reset_password_code' + ":" + userId;
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
        const cacheKey = 'customer_reset_password_code' + ":" + req.userId;
        const cacheData = await this.cacheDataRepository.findByKey(cacheKey);
        if (!cacheData || cacheData.cacheValue != req.code) {
            throw new CommonError(CommonErrorEnum.VERIFY_CODE_ERROR);
        }
        const resetToken = this.generateRandoString(8);
        const key = 'customer_reset_pwd_token' + ":" + req.userId;
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
        const cacheKey = 'customer_reset_pwd_token' + ":" + req.userId;
        const cacheData = await this.cacheDataRepository.findByKey(cacheKey);
        if (!cacheData || cacheData.cacheValue != req.resetToken) {
            throw new CommonError(AuthErrorEnum.RESET_PASSWORD_ERROR);
        }
        if (cacheData.id) {
            await this.cacheDataRepository.deleteById(cacheData.id);
        }
        await this.customerUserRepository.updateById({
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

    private validateRegisterRequest(fullName: string, email: string, password: string) {
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

    private async saveCacheData(key: string, value: string) {
        const cacheData: Partial<SysCacheData> = {
            id: SnowflakeUtil.generateBigString(),
            cacheKey: key,
            cacheValue: value,
            createTime: new Date().getTime()
        };
        await this.cacheDataRepository.insert(cacheData);
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
}
