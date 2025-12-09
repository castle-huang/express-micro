export interface EmailConfig {
    host: string;        // SMTP 服务器地址
    port: number;        // 端口
    secure: boolean;     // 是否使用 SSL/TLS
    user: string;        // 邮箱账号
    password: string;    // 邮箱密码/授权码
    from?: string;       // 默认发件人
}

export interface EmailOptions {
    to: string | string[];     // 收件人
    subject: string;           // 主题
    text?: string;            // 文本内容
    html?: string;            // HTML 内容
    from?: string;            // 发件人（可选，默认使用配置中的）
    cc?: string | string[];   // 抄送
    bcc?: string | string[];  // 密送
    attachments?: {           // 附件
        filename: string;
        path: string;           // 文件路径
        contentType?: string;
    }[];
}

export interface EmailSendResult {
    success: boolean;
    messageId?: string;
    error?: string;
}