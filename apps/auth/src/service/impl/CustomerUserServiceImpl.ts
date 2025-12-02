import {
    AuthenticatedRequest, CommonError, CommonErrorEnum,
    Inject, JWTUtils, Service, SnowflakeUtil
} from "@sojo-micro/rpc";
import {CustomerUserService} from "@/service/CustomerUserService";
import {
    CustomerUpdatePasswordReq,
    GetCustomerResp,
    LoginCustomerReq,
    LoginCustomerResp,
    RegisterCustomerReq,
    RegisterCustomerResp,
    UpdateCustomerUserReq
} from "@/types/AuthCustomerType";
import {CustomerUserRepository} from "@/repository/CustomerUserRepository";
import {AuthErrorEnum} from "@/types/AuthErrorEnum";


@Service()
export class CustomerUserServiceImpl implements CustomerUserService {

    constructor(@Inject() private customerUserRepository: CustomerUserRepository) {
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
}
