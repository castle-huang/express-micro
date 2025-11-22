import {IErrorItem} from "@sojo-micro/rpc";

export class BusinessErrorEnum {
    static USER_NOT_EXISTS: IErrorItem = {code: '1000100', msg: 'User not exists'};
    static USER_EXISTS: IErrorItem = {code: '1000101', msg: 'User already exists'};
    static VALIDATION_FAILED: IErrorItem = {code: '1000102', msg: 'All fields are required: contactName, email, password'};
}