import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { NotifyTaskUpdatedInputDto } from './notify-task-updated.input.dto';
import { NotifyTaskUpdatedOutputDto } from './notify-task-updated.output.dto';

@Injectable()
export class NotifyTaskUpdatedService {
  private readonly logger = new Logger(NotifyTaskUpdatedService.name);

  constructor(
    @Inject('RABBITMQ_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  notifyTaskUpdate(dto: NotifyTaskUpdatedInputDto): NotifyTaskUpdatedOutputDto {
    this.client.emit('task.updated', dto).subscribe({
      error: (error) => {
        this.logger.error(
          `Erro to send message about stask about from Task ${dto.taskId}`,
          error,
        );
      },
    });
    return null;
  }
}
