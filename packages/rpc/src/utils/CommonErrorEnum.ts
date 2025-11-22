export interface IErrorItem {
    code: string;
    msg: string;
}

export class CommonErrorEnum {
    static SYSTEM_EXCEPTION: IErrorItem = {code: '1000', msg: 'system exception'};
    static MISSING_AUTHORIZATION_HEADER: IErrorItem = {
        code: '1001',
        msg: 'Authorization header is required'
    };
    static MISSING_TOKEN: IErrorItem = {
        code: '1002', msg: 'Token is required'
    };
    static INVALID_TOKEN: IErrorItem = {
        code: '1003',
        msg: 'Invalid token'
    };
    static PARAMETER_ERROR: IErrorItem = {
        code: '1004',
        msg: 'Parameter check failed'
    };
    static DATA_NOT_FOUND: IErrorItem = {
        code: '1005',
        msg: 'Data does not exist'
    };
    static PERMISSION_DENIED: IErrorItem = {
        code: '1006',
        msg: 'Permission denied'
    };
}