import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import {
  type NotifyTaskUpdateInputDto,
  NotifyTaskUpdateUseCase,
} from './usecases';

@Controller()
export class HandleTasksQueueController {
  constructor(
    private readonly notifyTaskUpdateUseCase: NotifyTaskUpdateUseCase,
  ) {}

  @EventPattern('task.updated')
  async handleTaskUpdateNotification(
    dto: NotifyTaskUpdateInputDto,
  ): Promise<void> {
    await this.notifyTaskUpdateUseCase.notifyTaskUpdated(dto);
  }
}
