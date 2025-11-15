import { BaseResponse } from '../types/BaseResponse'
export class ResponseUtil {
    static success<T>(data?: T, message: string = 'Success'): BaseResponse {
        return {
            code: '0',
            msg: message,
            data: data || {}
        };
    }

    static error(code: string, message: string, data?: any): BaseResponse {
        return {
            code: code,
            msg: message,
            data: data || {}
        };
    }
}
