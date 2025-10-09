import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  UpdateTaskByIdService,
} from './services';
import { TaskRepository } from 'src/database/repositories';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
  controllers: [TaskController],
  providers: [
    DeleteTaskByIdUseCase,
    UpdateTaskByIdUseCase,
    LoadTaskByIdUseCase,
    CreateTaskUseCase,
    LoadTasksUseCase,
    DeleteTaskByIdService,
    UpdateTaskByIdService,
    LoadTasksService,
    LoadTaskByIdService,
    CreateTaskService,
    TaskRepository,
  ],
})
export class TaskModule {}
