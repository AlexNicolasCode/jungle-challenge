import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NotifyTaskCreatedInputDto } from './notify-task-created.input.dto';
import { NotifyTaskCreatedOutputDto } from './notify-task-created.output.dto';

@Injectable()
export class NotifyTaskCreatedService {
  private readonly logger = new Logger(NotifyTaskCreatedService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  notifyTaskCreated(
    dto: NotifyTaskCreatedInputDto,
  ): NotifyTaskCreatedOutputDto {
    try {
      this.client.emit('task.created', dto);
      return null;
    } catch (error) {
      this.logger.error(
        `Erro to send message about stask about from Task ${dto.taskId}`,
        error,
      );
      return null;
    }
  }
}
