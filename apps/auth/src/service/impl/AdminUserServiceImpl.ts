import {AdminUserService} from '../AdminUserService';
import {supabase} from "../../config/Supabase";
import {AuthenticatedRequest, CommonError, Inject, JWTUtils, Service, SnowflakeUtil} from "@sojo-micro/rpc";
import {MerchantUserRepository} from "../../repository/MerchantUserRepository";
import {LoginReq, LoginResp, ProfilesResp, SignUpReq, SignUpResp} from "../../types/AuthType";
import {AuthErrorEnum} from "../../types/AuthErrorEnum";

@Service ()
export class AdminUserServiceImpl implements AdminUserService {

    constructor(@Inject() private merchantUserRepository: MerchantUserRepository) {
    }
    async getProfiles(userId: string): Promise<ProfilesResp> {
        const merchantUser = await this.merchantUserRepository.findById(userId);
        return {
            avatarUrl: merchantUser?.avatarUrl || '',
            fullName: merchantUser?.fullName || '',
            phoneCode: merchantUser?.phoneCode || '',
            phone: merchantUser?.phone || '',
            fullPhone: merchantUser?.fullPhone || '',
            email: merchantUser?.email || '',
        };
    }

    /**
     * Login
     */
    async login(req: LoginReq): Promise<LoginResp> {
        this.validateLoginRequest(req.email, req.password);
        const merchantUser = await this.merchantUserRepository.findByEmail(req.email);
        if (!merchantUser) {
            throw new CommonError(AuthErrorEnum.USER_NOT_EXISTS)
        }
        const payload: AuthenticatedRequest = {
            user: {
                id: merchantUser.id,
            }
        } as AuthenticatedRequest;
        const token = JWTUtils.generateToken(payload);
        return {
            token: token,
        }
    }

    /**
     * Register
     */
    async register(req: SignUpReq): Promise<SignUpResp> {
        this.validateSignUpRequest(req.contactName, req.email, req.password);
        const merchantUser = await this.merchantUserRepository.findByEmail(req.email);
        if (merchantUser) {
            throw new CommonError(AuthErrorEnum.USER_EXISTS, 'User already exists');
        }
        const userId = SnowflakeUtil.generateBigString();
        const { data, error } = await supabase
            .from('merchant_user')
            .insert([
                {
                    id: userId,
                    full_name: req.contactName,
                    email: req.email,
                    password: req.password,
                },
            ]).select()
        const payload: AuthenticatedRequest = {
            user: {
                id: userId,
            }
        } as AuthenticatedRequest;
        const token = JWTUtils.generateToken(payload);
        return {
            token: token
        };
    }

    private validateLoginRequest(email: string, password: string) {
        if (!email || !password) {
            throw new CommonError(AuthErrorEnum.VALIDATION_FAILED, 'All fields are required: contactName, email, password');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CommonError(AuthErrorEnum.VALIDATION_FAILED, 'Invalid email format');
        }
    }

    private validateSignUpRequest(contactName: string, email: string, password: string) {
        if (!contactName || !email || !password) {
            throw new CommonError(AuthErrorEnum.VALIDATION_FAILED);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CommonError(AuthErrorEnum.VALIDATION_FAILED);
        }
    }
}
