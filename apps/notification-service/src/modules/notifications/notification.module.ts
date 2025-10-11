import { Module } from '@nestjs/common';

import { HandleTasksQueueController } from './handle-tasks-queue.controller';
import { SendNotificationToClientService } from './services';
import { NotifyTaskCreatedUseCase, NotifyTaskUpdateUseCase } from './usecases';

@Module({
  imports: [],
  controllers: [HandleTasksQueueController],
  providers: [
    NotifyTaskUpdateUseCase,
    NotifyTaskCreatedUseCase,
    SendNotificationToClientService,
  ],
})
export class NotificationModule {}
