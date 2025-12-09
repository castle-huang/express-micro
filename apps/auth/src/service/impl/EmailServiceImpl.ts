import {Service} from "@sojo-micro/rpc";
import {EmailService} from "@/service/EmailService";
import {EmailConfig, EmailOptions, EmailSendResult} from "@/config/EmailConfig";
import nodemailer from 'nodemailer';

@Service()
export class EmailServiceImpl implements EmailService {
    private transporter: nodemailer.Transporter;
    private config: EmailConfig;

    constructor() {

        // 配置 Gmail SMTP 设置
        this.config = {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // 587 端口使用 STARTTLS
            user: process.env.GMAIL_USER || 'richardnet0909@gmail.com', // 从环境变量获取
            password: process.env.GMAIL_APP_PASSWORD || 'bgam flcb imin rnvu', // Gmail 应用专用密码
            from: process.env.GMAIL_FROM || process.env.GMAIL_USER || 'sojo'
        };

        // 创建邮件传输器
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587, // 不要使用 465，使用 587
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'richardnet0909@gmail.com',
                pass: 'bgam flcb imin rnvu'
            },
        });
    }

    /**
     * 发送纯文本邮件
     */
    async sendTextEmail(to: string | string[], subject: string, text: string): Promise<EmailSendResult> {
        return this.sendEmail({
            to,
            subject,
            text
        });
    }

    /**
     * 发送HTML邮件
     */
    async sendHtmlEmail(to: string | string[], subject: string, html: string): Promise<EmailSendResult> {
        return this.sendEmail({
            to,
            subject,
            html
        });
    }

    /**
     * 发送邮件
     * @param options 邮件选项
     * @returns 发送结果
     */
    async sendEmail(options: EmailOptions): Promise<EmailSendResult> {
        try {
            const from = options.from || this.config.from || this.config.user;

            const mailOptions = {
                from: `sojo`, // 格式化为 "名称 <邮箱>"
                to: this.formatRecipients(options.to),
                subject: options.subject,
                text: options.text,
                html: options.html,
                cc: options.cc ? this.formatRecipients(options.cc) : undefined,
                bcc: options.bcc ? this.formatRecipients(options.bcc) : undefined,
                attachments: options.attachments
            };

            const info = await this.transporter.sendMail(mailOptions);

            return {
                success: true,
                messageId: info.messageId
            };
        } catch (error) {
            console.error('发送邮件失败:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : '未知错误'
            };
        }
    }

    /**
     * 格式化收件人列表
     */
    private formatRecipients(recipients: string | string[]): string {
        if (Array.isArray(recipients)) {
            return recipients.join(', ');
        }
        return recipients;
    }


}