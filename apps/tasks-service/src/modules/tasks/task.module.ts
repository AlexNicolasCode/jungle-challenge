import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TaskController } from './task.controller';
import { TaskEntity, UserEntity } from 'src/database/entities';
import {
  CreateTaskUseCase,
  DeleteTaskByIdUseCase,
  LoadTaskByIdUseCase,
  LoadTasksUseCase,
  UpdateTaskByIdUseCase,
} from './usecases';
import {
  CreateTaskService,
  DeleteTaskByIdService,
  LoadTaskByIdService,
  LoadTasksService,
  NotifyTaskCreatedService,
  NotifyTaskUpdatedService,
  UpdateTaskByIdService,
} from './services';
import { TaskRepository } from 'src/database/repositories';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://admin:admin@localhost:5672'],
          queue: 'tasks',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [TaskController],
  providers: [
    DeleteTaskByIdUseCase,
    UpdateTaskByIdUseCase,
    LoadTaskByIdUseCase,
    CreateTaskUseCase,
    LoadTasksUseCase,
    NotifyTaskCreatedService,
    DeleteTaskByIdService,
    UpdateTaskByIdService,
    LoadTasksService,
    LoadTaskByIdService,
    CreateTaskService,
    TaskRepository,
    NotifyTaskUpdatedService,
  ],
  exports: [LoadTaskByIdService],
})
export class TaskModule {}
