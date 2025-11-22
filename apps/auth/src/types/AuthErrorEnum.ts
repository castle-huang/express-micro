import {IErrorItem} from "@sojo-micro/rpc";

export class AuthErrorEnum {
    static USER_NOT_EXISTS: IErrorItem = {code: '1000100', msg: 'User not exists'};
    static LOGIN_FAILED: IErrorItem = {code: '1000101', msg: 'Invalid email or password'};
    static EMAIL_ALREADY_USED: IErrorItem = {code: '1000102', msg: 'Email already in use'};
}