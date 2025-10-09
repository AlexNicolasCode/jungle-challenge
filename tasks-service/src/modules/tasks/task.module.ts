import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskController } from './task.controller';
import { TaskEntity, UserEntity } from 'src/database/entities';
import {
  CreateTaskUseCase,
  LoadTaskByIdUseCase,
  LoadTasksUseCase,
} from './usecases';
import {
  CreateTaskService,
  LoadTaskByIdService,
  LoadTasksService,
} from './services';
import { TaskRepository } from 'src/database/repositories';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
  controllers: [TaskController],
  providers: [
    LoadTaskByIdUseCase,
    CreateTaskUseCase,
    LoadTasksUseCase,
    LoadTasksService,
    LoadTaskByIdService,
    CreateTaskService,
    TaskRepository,
  ],
})
export class TaskModule {}
