interface IErrorItem {
    code: string;
    msg?: string;
}

export class CommonErrorEnum {
    static readonly VALIDATION_FAILED: IErrorItem = {code: 'VALIDATION_FAILED', msg: '数据验证失败'};
    static readonly USER_EXISTS: IErrorItem = {code: 'USER_EXISTS', msg: '用户已存在'};
    static readonly INVALID_CREDENTIALS: IErrorItem = {code: 'INVALID_CREDENTIALS', msg: '无效的凭据'};
    static readonly USER_NOT_EXISTS: IErrorItem = {code: 'USER_NOT_EXISTS', msg: '用户不存在'};
}