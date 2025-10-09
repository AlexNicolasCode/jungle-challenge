import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskController } from './task.controller';
import { TaskEntity, UserEntity } from 'src/database/entities';
import { CreateTaskUseCase } from './usecases';
import { CreateTaskService } from './services';
import { TaskRepository } from 'src/database/repositories';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([UserEntity, TaskEntity]),
  ],
  controllers: [TaskController],
  providers: [CreateTaskUseCase, CreateTaskService, TaskRepository],
})
export class TaskModule {}
