import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentController } from './comment.controller';
import { CommentEntity, UserEntity } from 'src/database/entities';
import { CommentRepository } from 'src/database/repositories';
import { CreateCommentService, LoadCommentsService } from './services';
import { CreateCommentUseCase, LoadCommentsUseCase } from './usecases';
import { TaskModule } from '../tasks/task.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([CommentEntity, UserEntity]),
    TaskModule,
  ],
  controllers: [CommentController],
  providers: [
    LoadCommentsUseCase,
    CreateCommentUseCase,
    LoadCommentsService,
    CreateCommentService,
    CommentRepository,
  ],
})
export class CommentModule {}
