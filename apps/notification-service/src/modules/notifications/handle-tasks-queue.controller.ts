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
  handleTaskUpdateNotification(dto: NotifyTaskUpdateInputDto): void {
    this.notifyTaskUpdateUseCase.notifyTaskUpdated(dto);
  }
}
