// src/service/S3UploadService.ts
import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3";
import {CommonError, CommonErrorEnum, Component} from "@sojo-micro/rpc";

@Component()
export class S3UploadService {
    private s3Client: S3Client;

    private readonly endpoint: string;

    constructor() {
        this.endpoint = process.env.AWS_ENDPOINT || "https://s3-noi.aces3.ai/"
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION || "us-east-1",
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || "AKIAFBC97UM4I3ILWTIKQ",
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "vMUNWcZvMesuFfmUwdUYnsaOr1pp38wu8nOon8eb",
            },
            endpoint: this.endpoint,
            forcePathStyle: true,
            requestChecksumCalculation: "WHEN_REQUIRED",
            responseChecksumValidation: "WHEN_REQUIRED",
        });
    }

    /**
     * 上传文件到S3
     * @param file 文件对象
     * @param bucketName 存储桶名称
     * @param key 文件key
     * @returns 上传结果
     */
    async uploadFile(file: Express.Multer.File, bucketName: string, key?: string): Promise<any> {
        const fileKey = key || `sojo/${Date.now()}_${file.originalname}`;

        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        try {
            const command = new PutObjectCommand(params);
            const result = await this.s3Client.send(command);

            return {
                Location: `${this.endpoint}${bucketName}/${fileKey}`,
                Key: fileKey,
                ...result
            };
        } catch (error) {
            console.error('S3 upload error:', error);
            throw new CommonError(CommonErrorEnum.UPLOAD_FAILED);
        }
    }

    /**
     * 生成唯一的文件key
     * @param originalName 原始文件名
     * @returns 唯一的文件key
     */
    generateUniqueKey(originalName: string): string {
        return `sojo/${Date.now()}_${originalName}`;
    }
}
