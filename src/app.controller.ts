import { Body, Query, Controller, Get, Post, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import fs from 'fs'

@Controller('api')
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    // /api/upload 处理大文件上传
    @Post('upload') // Post装饰器 用于将post类型的请求路由到指定处理方法
    // 加载FilesInterceptor拦截器
    @UseInterceptors(FilesInterceptor('files', 20, {
        dest: 'uploads'
    }))
    // @UploadedFiles()装饰器用于从请求中获取上传的文件
    uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
        console.log('body----', body);
        console.log('files----', files);

    }

    // 合并图片
    @Get('merge')
    merge(@Query('name') name: string) {
        const chunkDir = 'uploads/chunks_' + name;

        const files = fs.readdirSync(chunkDir);

        let startPos = 0;
        files.map(file => {
            const filePath = chunkDir + '/' + file;
            const stream = fs.createReadStream(filePath);
            stream.pipe(fs.createWriteStream('uploads/' + name, {
                start: startPos
            }))

            startPos += fs.statSync(filePath).size;
        })
    }




    //使用@Body装饰器来获取请求体中的数据，@Param装饰器来获取路径参数，@Query装饰器来获取查询参数
}

