import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

import {
    type NotifyCommentInputDto,
    type NotifyTaskCreatedInputDto,
    type NotifyTaskUpdateInputDto,
    NotifyCommentCreatedUseCase,
    NotifyTaskCreatedUseCase,
    NotifyTaskUpdateUseCase,
} from './usecases';

@Controller()
export class HandleTasksQueueController {
  constructor(
    private readonly notifyTaskUpdateUseCase: NotifyTaskUpdateUseCase,
    private readonly notifyTaskCreatedUseCase: NotifyTaskCreatedUseCase,
    private readonly notifyCommentCreatedUseCase: NotifyCommentCreatedUseCase,
  ) {}

  @EventPattern('task.updated')
  handleTaskUpdateNotification(dto: NotifyTaskUpdateInputDto): void {
    this.notifyTaskUpdateUseCase.notifyTaskUpdated(dto);
  }

  @EventPattern('task.created')
  handleTaskCreatedNotification(dto: NotifyTaskCreatedInputDto): void {
    this.notifyTaskCreatedUseCase.notifyTaskCreated(dto);
  }

  @EventPattern('task.comment.created')
  handleTaskNewCommentNotification(dto: NotifyCommentInputDto): void {
    this.notifyCommentCreatedUseCase.notifyCommentCreated(dto);
  }
}
