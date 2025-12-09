import {EmailSendResult} from "@/config/EmailConfig";

export abstract class EmailService {
    abstract sendTextEmail(to: string | string[], subject: string, text: string): Promise<EmailSendResult>
}