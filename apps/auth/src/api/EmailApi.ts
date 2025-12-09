import {Inject, RpcMethod, RpcService} from "@sojo-micro/rpc";
import {EmailService} from "@/service/EmailService";
import {EmailSendResult} from "@/config/EmailConfig";

@RpcService({name: "email-api"})
export class EmailApi {
    constructor(@Inject() private emailService: EmailService) {
    }

    @RpcMethod()
    async sendTextEmail(to: string | string[], subject: string, text: string): Promise<EmailSendResult> {
        return await this.emailService.sendTextEmail(to, subject, text);
    }
}