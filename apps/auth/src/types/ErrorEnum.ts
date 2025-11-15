export enum ErrorEnum {
    VALIDATION_FAILED = 'VALIDATION_FAILED',
    USER_EXISTS = 'USER_EXISTS',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    USER_NOT_EXISTS = 'USER_NOT_EXISTS',
}

export class CommonError extends Error {
    constructor(public code: ErrorEnum, public msg: string) {
        super(msg);
        this.name = 'CommonError';
    }
}