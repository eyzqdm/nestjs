import { Body, Query, Controller, Get, Post, UseInterceptors, UploadedFiles, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AppService } from './app.service';
const fs = require('fs')

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
    @UseInterceptors(FilesInterceptor('file', 10, {

        storage: diskStorage({
            destination: './uploads/',
            filename: (req, file, cb) => {
                console.log('file.originalname>>>>>>>');
                return cb(null, file.originalname);
            },
        }),
    }))
    // @UploadedFiles()装饰器用于从请求中获取上传的文件
    uploadFile(@UploadedFiles() files, @Body() body) {
        console.log('body----', body);
        console.log('files----', files);
        const fileName = body.name.match(/(.+)\-\d+$/)[1];
        const chunkDir = 'uploads/chunks_' + fileName;
        const filePath = files?.[0]?.path



        if (!fs.existsSync(chunkDir)) {
            fs.mkdirSync(chunkDir);
        }
        fs.cpSync(filePath, chunkDir + '/' + body.name);
        fs.rmSync(filePath);
        return { message: '文件上传成功' };

    }

    // 合并文件
    @Get('merge')
    merge(@Query('name') name: string) {
        const chunkDir = 'uploads/chunks_' + name;

        const files = fs.readdirSync(chunkDir);

        let startPos = 0;
        files.map((file, index) => {
            const filePath = chunkDir + '/' + file;
            //创建可读流，分块读取文件内容，不会一次性将整个文件加载到内存中，可以更有效地处理大型文件
            const stream = fs.createReadStream(filePath);
            //读取文件内容，首位相接
            stream.pipe(fs.createWriteStream('uploads/' + name, {
                start: startPos
            })).on('finish', () => {
                // 合并完成删除文件
                if (index === files.length - 1) {
                    fs.rmdirSync(chunkDir, { recursive: true });
                }
            })
            startPos += fs.statSync(filePath).size;
        })
        //删除文件切片
        return { message: '文件合并成功' };
    }




    //使用@Body装饰器来获取请求体中的数据，@Param装饰器来获取路径参数，@Query装饰器来获取查询参数
}

