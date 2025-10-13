import { Injectable, Logger } from '@nestjs/common';

import { SendNotificationToClientService } from '../../services';
import { NotifyTaskUpdateInputDto } from './notify-task-update.input.dto';

@Injectable()
export class NotifyTaskUpdateUseCase {
  private readonly logger = new Logger(NotifyTaskUpdateUseCase.name);

  constructor(
    private readonly sendNotificationToClientService: SendNotificationToClientService,
  ) {}

  notifyTaskUpdated(dto: NotifyTaskUpdateInputDto): void {
    try {
      this.sendNotificationToClientService.sendNotificationToClient({
        userId: dto.authorId,
        taskId: dto.taskId,
        taskTitle: dto.taskTitle,
        event: 'task:updated',
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
