import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskController } from './task.controller';
import { TaskEntity, UserEntity } from 'src/database/entities';
import { CreateTaskUseCase, LoadTasksUseCase } from './usecases';
import { CreateTaskService, LoadTasksService } from './services';
import { TaskRepository } from 'src/database/repositories';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    LoadTasksUseCase,
    LoadTasksService,
    CreateTaskService,
    TaskRepository,
  ],
})
export class TaskModule {}
