import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { CommentEntity, UserEntity } from 'src/database/entities';
import { CommentRepository } from 'src/database/repositories';
import { TaskModule } from '../tasks/task.module';
import { CommentController } from './comment.controller';
import { CreateCommentService, LoadCommentsService } from './services';
import { NotifyCommentCreatedService } from './services/notify-comment-created';
import { CreateCommentUseCase, LoadCommentsUseCase } from './usecases';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([CommentEntity, UserEntity]),
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
    TaskModule,
  ],
  controllers: [CommentController],
  providers: [
    LoadCommentsUseCase,
    CreateCommentUseCase,
    LoadCommentsService,
    CreateCommentService,
    NotifyCommentCreatedService,
    CommentRepository,
  ],
})
export class CommentModule {}
