import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NotifyCommentCreatedInputDto } from './notify-comment-created.input.dto';
import { NotifyCommentCreatedOutputDto } from './notify-comment-created.output.dto';

@Injectable()
export class NotifyCommentCreatedService {
  private readonly logger = new Logger(NotifyCommentCreatedService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  notifyCommentCreated(
    dto: NotifyCommentCreatedInputDto,
  ): NotifyCommentCreatedOutputDto {
    try {
      this.client.emit('task.comment.created', dto);
      return null;
    } catch (error) {
      this.logger.error(
        `Erro to send message about stask about from Task ${dto.task.id}`,
        error,
      );
      return null;
    }
  }
}
