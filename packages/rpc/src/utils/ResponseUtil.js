"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtil = void 0;
class ResponseUtil {
    static success(data, message = 'Success') {
        return {
            code: '0',
            msg: message,
            data: data || {}
        };
    }
    static commonError(code, message, data) {
        return {
            code: code,
            msg: message,
            data: data || {}
        };
    }
    static error(errorItem, data) {
        return ResponseUtil.commonError(errorItem.code, errorItem.msg || "", data || {});
    }
}
exports.ResponseUtil = ResponseUtil;
