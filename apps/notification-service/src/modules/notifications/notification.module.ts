import { Module } from '@nestjs/common';

import { HandleTasksQueueController } from './handle-tasks-queue.controller';
import { SendNotificationToClientService } from './services';
import { NotifyTaskUpdateUseCase } from './usecases';

@Module({
  imports: [],
  controllers: [HandleTasksQueueController],
  providers: [NotifyTaskUpdateUseCase, SendNotificationToClientService],
})
export class NotificationModule {}
