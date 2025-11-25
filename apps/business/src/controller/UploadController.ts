import {Controller, File, Inject, POST, ResponseUtil} from "@sojo-micro/rpc";
import {S3UploadService} from "@/component/S3UploadService";

@Controller({basePath: '/api/biz/upload'})
export class UploadController {
    constructor(@Inject() private s3UploadService: S3UploadService) {
    }

    @POST()
    async upload(@File() file: Express.Multer.File) {
        let key = this.s3UploadService.generateUniqueKey(file.originalname);
        const res = await this.s3UploadService.uploadFile(file, 'invent-co-new', key)
        return ResponseUtil.success({url: res.Location});
    }
}