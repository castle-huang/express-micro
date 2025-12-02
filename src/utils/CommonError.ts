import {IErrorItem} from "./CommonErrorEnum";

export class CommonError extends Error {
    constructor(public code: string | IErrorItem, public msg?: string) {
        super(msg);
        this.name = 'CommonError';
    }
}