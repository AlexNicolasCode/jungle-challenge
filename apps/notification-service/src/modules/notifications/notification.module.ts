import { Module } from '@nestjs/common';

import { HandleTasksQueueController } from './handle-tasks-queue.controller';
import {
    SendCommentService,
    SendNotificationToClientService,
} from './services';
import {
    NotifyCommentCreatedUseCase,
    NotifyTaskCreatedUseCase,
    NotifyTaskUpdateUseCase,
} from './usecases';

@Module({
  imports: [],
  controllers: [HandleTasksQueueController],
  providers: [
    NotifyTaskUpdateUseCase,
    NotifyTaskCreatedUseCase,
    NotifyCommentCreatedUseCase,
    SendNotificationToClientService,
    SendCommentService,
  ],
})
export class NotificationModule {}
