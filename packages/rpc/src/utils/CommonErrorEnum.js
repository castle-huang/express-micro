"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonErrorEnum = void 0;
class CommonErrorEnum {
}
exports.CommonErrorEnum = CommonErrorEnum;
CommonErrorEnum.SYSTEM_EXCEPTION = { code: '1000', msg: 'system exception' };
CommonErrorEnum.MISSING_AUTHORIZATION_HEADER = {
    code: '1001',
    msg: 'Authorization header is required'
};
CommonErrorEnum.MISSING_TOKEN = {
    code: '1002', msg: 'Token is required'
};
CommonErrorEnum.INVALID_TOKEN = {
    code: '1003',
    msg: 'Invalid token'
};
