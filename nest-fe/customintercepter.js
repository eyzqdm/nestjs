/* 如果前端使用`FormData`对象的`files`字段携带`ArrayBuffer`类型的文件数据，并且你想要使用`FilesInterceptor`拦截器来处理文件上传，你可以通过自定义`FileInterceptor`来实现对`ArrayBuffer`类型的文件数据的处理。

首先，你需要创建一个自定义的`FileInterceptor`，并在其中实现对`ArrayBuffer`类型的文件数据的处理逻辑。以下是一个示例代码： */

/* ```typescript
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@Injectable()
export class CustomFileInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    return next.handle();
  }
}
```

在上面的示例中，我们创建了一个名为`CustomFileInterceptor`的自定义拦截器，并实现了`NestInterceptor`接口。在`intercept`方法中，我们可以获取到请求对象，并从中获取`FormData`对象的数据。然后，可以将`ArrayBuffer`类型的文件数据转换成`Buffer`，并保存到服务器中。

接下来，你可以在控制器中使用自定义的`FileInterceptor`来处理文件上传。以下是一个示例代码：

```typescript
import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CustomFileInterceptor } from './custom-file.interceptor';

@Controller('file')
export class AppController {
  @Post('upload')
  @UseInterceptors(new CustomFileInterceptor())
  async uploadFile(@UploadedFiles() files) {
    return { message: 'File uploaded successfully' };
  }
}
```

在上面的示例中，我们使用`@UseInterceptors()`装饰器来应用自定义的`FileInterceptor`，并在路由处理函数中使用`@UploadedFiles()`装饰器来获取上传的文件信息。

需要注意的是，自定义的`FileInterceptor`中的具体处理逻辑需要根据前端发送的数据结构进行调整。你可能需要使用`multer`等文件上传处理中间件来实现文件的保存逻辑。 */