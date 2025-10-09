import { Module } from '@nestjs/common';

import { HandleTasksQueueController } from './handle-tasks-queue.controller';
import { NotifyTaskUpdateUseCase } from './usecases';

@Module({
  imports: [],
  controllers: [HandleTasksQueueController],
  providers: [NotifyTaskUpdateUseCase],
})
export class NotificationModule {}
