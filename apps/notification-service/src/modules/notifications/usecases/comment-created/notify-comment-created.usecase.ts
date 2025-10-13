import { Injectable, Logger } from '@nestjs/common';

import { SendCommentService } from '../../services';
import { NotifyCommentInputDto } from './notify-comment-created.input.dto';

@Injectable()
export class NotifyCommentCreatedUseCase {
  private readonly logger = new Logger(NotifyCommentCreatedUseCase.name);

  constructor(private readonly sendCommentService: SendCommentService) {}

  notifyCommentCreated(dto: NotifyCommentInputDto): void {
    try {
      this.sendCommentService.sendComment({
        task: dto.task,
        comment: dto.comment,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
