import { Injectable, Logger } from '@nestjs/common';

import { SendNotificationToClientService } from '../../services';
import { NotifyTaskCreatedInputDto } from './notify-task-created.input.dto';

@Injectable()
export class NotifyTaskCreatedUseCase {
  private readonly logger = new Logger(NotifyTaskCreatedUseCase.name);

  constructor(
    private readonly sendNotificationToClientService: SendNotificationToClientService,
  ) {}

  notifyTaskCreated(dto: NotifyTaskCreatedInputDto): void {
    try {
      this.sendNotificationToClientService.sendNotificationToClient({
        userId: dto.authorId,
        taskId: dto.taskId,
        taskTitle: dto.taskTitle,
        event: 'task:created',
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
