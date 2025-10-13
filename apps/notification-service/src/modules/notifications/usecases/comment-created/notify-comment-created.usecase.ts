import { Injectable, Logger } from '@nestjs/common';

import {
    SendCommentService,
    SendNotificationToClientService,
} from '../../services';
import { NotifyCommentInputDto } from './notify-comment-created.input.dto';

@Injectable()
export class NotifyCommentCreatedUseCase {
  private readonly logger = new Logger(NotifyCommentCreatedUseCase.name);

  constructor(
    private readonly sendNotificationToClientService: SendNotificationToClientService,
    private readonly sendCommentService: SendCommentService,
  ) {}

  notifyCommentCreated(dto: NotifyCommentInputDto): void {
    try {
      for (const userId of dto.task.releatedUsersId) {
        this.sendNotificationToClientService.sendNotificationToClient({
          taskId: dto.task.id,
          taskTitle: dto.task.title,
          userId: userId,
          type: 'COMMENT_CREATED',
        });
      }
      this.sendCommentService.sendComment({
        taskId: dto.task.id,
        comment: dto.comment,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
