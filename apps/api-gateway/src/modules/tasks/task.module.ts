import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TaskController } from './task.controller';
import { LoadLoggedUserMiddleware } from 'src/shared/middlewares';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3001 },
      },
      {
        name: 'TASK_SERVICE',
        transport: Transport.TCP,
        options: { host: '127.0.0.1', port: 3002 },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoadLoggedUserMiddleware).forRoutes('/api/tasks');
  }
}
