import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { NotifyTaskUpdateInputDto } from './notify-task-update.input.dto';

@Injectable()
export class NotifyTaskUpdateUseCase {
  private readonly logger = new Logger(NotifyTaskUpdateUseCase.name);

  constructor() {}

  async notifyTaskUpdated(dto: NotifyTaskUpdateInputDto): Promise<void> {
    try {
      console.log(dto);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
