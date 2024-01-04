import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestMiddleware } from './mid.middleware';
import { MulterModule } from '@nestjs/platform-express'


@Module({
    imports: [
        MulterModule.register({
            dest: './uploads/',
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // 应用中间件到所有路由
        consumer.apply(TestMiddleware).forRoutes('*');
    }
}
