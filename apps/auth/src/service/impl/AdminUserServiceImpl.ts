import {AdminUserService} from '../AdminUserService';
import {supabase} from "../../config/Supabase";
import {Inject, Service} from "@sojo-micro/rpc";
import {CommonError, ErrorEnum} from "../../types/ErrorEnum";
import {LoginReq, LoginResp, ProfilesResp, SignUpReq, SignUpResp} from "../../types/AuthModel";
import SnowflakeUtil from "../../utils/IdUtils";
import {MerchantUserDao} from "../../dao/MerchantUserDao";
import e from "express";
import {MerchantUser} from "../../types/entity/MerchantUser";
@Service ()
export class AdminUserServiceImpl implements AdminUserService {

    constructor(@Inject() private merchantUserDao: MerchantUserDao) {
    }
    async getProfiles(token: string): Promise<ProfilesResp> {
        token = "eyJhbGciOiJIUzI1NiIsImtpZCI6IkJlbEh4N2tQWkRyaVNMclkiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2F4ZnZsdmJ1anlvc29lbnB6amd0LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJhODQ4NGVlNi1lYmExLTRmYjYtYTNlOC1jYmI5N2IyM2QwMDUiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzYzMjE2OTYwLCJpYXQiOjE3NjMxMzA1NjAsImVtYWlsIjoidGVzdDExMjdAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6eyJjb250YWN0TmFtZSI6ImZmIiwiZW1haWwiOiJ0ZXN0MTEyN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJhODQ4NGVlNi1lYmExLTRmYjYtYTNlOC1jYmI5N2IyM2QwMDUifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTc2MzEzMDU2MH1dLCJzZXNzaW9uX2lkIjoiZTc5ZjQyM2ItMDAzZS00YTViLTkwMzItMzhhNWI1ZDZmYzQ3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.mu_NTYEANjHfXU3AM-Ler9mRqaIOEh9jTyKigPpDgoA";
        const { data: { user } } = await supabase.auth.getUser(token);
        return {
            avatarUrl: user?.user_metadata?.avatar_url || '',
            fullName: user?.user_metadata?.full_name || '',
            phone: user?.user_metadata?.phone || '',
        };
    }

    /**
     * Login
     */
    async login(req: LoginReq): Promise<LoginResp> {
        const merchantUser = await this.merchantUserDao.findByEmail(req.email);
        if (!merchantUser) {
            throw new CommonError(ErrorEnum.USER_NOT_EXISTS, 'User not exists')
        }
        return {
            token: 'fff',
        }
    }

    /**
     * Register
     */
    async register(request: SignUpReq): Promise<SignUpResp> {
        const { contactName, email, password } = request;
        this.validateSignUpRequest(contactName, email, password);
        let { data: merchant_user} = await supabase
            .from('merchant_user')
            .select('*').eq('email', email).single()
        if (merchant_user) {
            throw new CommonError(ErrorEnum.USER_EXISTS, 'User already exists');
        }
        const { data, error } = await supabase
            .from('merchant_user')
            .insert([
                {
                    id: SnowflakeUtil.generateId(),
                    full_name: contactName,
                    email: email,
                    password: password,
                },
            ]).select()

        return {
            token: '1234'
        };
    }

    private validateSignUpRequest(contactName: string, email: string, password: string) {
        if (!contactName || !email || !password) {
            throw new CommonError(ErrorEnum.VALIDATION_FAILED, 'All fields are required: contactName, email, password');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new CommonError(ErrorEnum.VALIDATION_FAILED, 'All fields are required: contactName, email, password');
        }
    }
}
