export abstract class EmailRpcApiService {
    abstract sendTextEmail(to: string | string[], subject: string, text: string): Promise<EmailSendResult>;
}

export interface EmailSendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}