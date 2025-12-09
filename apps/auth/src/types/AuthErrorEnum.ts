import {IErrorItem} from "@sojo-micro/rpc";

export class AuthErrorEnum {
    static USER_NOT_EXISTS: IErrorItem = {code: '1000100', msg: 'User not exists'};
    static LOGIN_FAILED: IErrorItem = {code: '1000101', msg: 'Invalid email or password'};
    static EMAIL_ALREADY_USED: IErrorItem = {code: '1000102', msg: 'Email already in use'};
    static WRONG_OLD_PASSWORD: IErrorItem = {code: '1000103', msg: 'Please enter the correct old password.'};
    static RESET_PASSWORD_ERROR: IErrorItem = {code: '1000104', msg: 'Password reset failed'};
}