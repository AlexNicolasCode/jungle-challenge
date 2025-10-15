import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';

import { LoadTaskByIdService } from '../../services';
import { LoadTaskByIdUseCaseInputDto } from './load-task-by-id.input.dto';
import { LoadTaskByIdUseCaseOutputDto } from './load-task-by-id.output.dto';

@Injectable()
export class LoadTaskByIdUseCase {
  private readonly logger = new Logger(LoadTaskByIdUseCase.name);

  constructor(private readonly loadTaskByIdService: LoadTaskByIdService) {}

  async execute(
    dto: LoadTaskByIdUseCaseInputDto,
  ): Promise<LoadTaskByIdUseCaseOutputDto> {
    const task = await this.loadTaskByIdService.loadTaskById({
      taskId: dto.id,
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    try {
      return task;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
