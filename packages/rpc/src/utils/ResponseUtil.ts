import {BaseResponse} from './BaseResponse'
import {IErrorItem} from "./CommonErrorEnum";

export class ResponseUtil {
    static success<T>(data?: T, message: string = 'Success'): BaseResponse {
        return {
            code: '0',
            msg: message,
            data: data || {}
        };
    }

    static commonError(code: string, message: string, data?: any): BaseResponse {
        return {
            code: code,
            msg: message,
            data: data || {}
        };
    }

    static error(errorItem: IErrorItem, data?: any): BaseResponse {
        return ResponseUtil.commonError(errorItem.code, errorItem.msg || "", data || {});
    }
}
