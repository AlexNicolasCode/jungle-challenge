import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import {
    type NotifyTaskCreatedInputDto,
    type NotifyTaskUpdateInputDto,
    NotifyTaskCreatedUseCase,
    NotifyTaskUpdateUseCase,
} from './usecases';

@Controller()
export class HandleTasksQueueController {
  constructor(
    private readonly notifyTaskUpdateUseCase: NotifyTaskUpdateUseCase,
    private readonly notifyTaskCreatedUseCase: NotifyTaskCreatedUseCase,
  ) {}

  @EventPattern('task.updated')
  handleTaskUpdateNotification(dto: NotifyTaskUpdateInputDto): void {
    this.notifyTaskUpdateUseCase.notifyTaskUpdated(dto);
  }

  @EventPattern('task.created')
  handleTaskCreatedNotification(dto: NotifyTaskCreatedInputDto): void {
    this.notifyTaskCreatedUseCase.notifyTaskCreated(dto);
  }
}
