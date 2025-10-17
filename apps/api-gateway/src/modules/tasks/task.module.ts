import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { LoadLoggedUserMiddleware } from 'src/shared/middlewares';
import { TaskCommentGateway } from './task-comment.gateway';
import { TaskController } from './task.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE ?? '127.0.0.1',
          port: process.env.AUTH_SERVICE_PORT ? Number(process.env.AUTH_SERVICE_PORT) : 3002,
          retryAttempts: 10,
          retryDelay: 3000,
        },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.TASKS_SERVICE ?? '127.0.0.1',
          port: process.env.TASKS_SERVICE_PORT ? Number(process.env.TASKS_SERVICE_PORT) : 3003,
          retryAttempts: 10,
          retryDelay: 3000,
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskCommentGateway],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoadLoggedUserMiddleware).forRoutes('/api/tasks');
  }
}
