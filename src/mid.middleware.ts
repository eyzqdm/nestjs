import { Injectable, NestMiddleware } from '@nestjs/common';
import { request, response } from 'express';

@Injectable()
export class TestMiddleware implements NestMiddleware {
    // 手动标注express or fastify类型
    use(req: Request, res: Response, next: () => void) {
        console.log('before');
        next();
        console.log('after');
    }

}
