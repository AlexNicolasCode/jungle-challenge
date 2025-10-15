import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { LoadTasksService } from '../../services';
import { LoadTasksUseCaseInputDto } from './load-tasks.input.dto';
import { LoadTasksUseCaseOutputDto } from './load-tasks.output.dto';

@Injectable()
export class LoadTasksUseCase {
  private readonly logger = new Logger(LoadTasksUseCase.name);

  constructor(private readonly loadTasksService: LoadTasksService) {}

  async execute(
    dto: LoadTasksUseCaseInputDto,
  ): Promise<LoadTasksUseCaseOutputDto> {
    try {
      const { count, tasks } = await this.loadTasksService.loadTasks(dto);
      return {
        list: tasks,
        page: dto.page,
        size: dto.size,
        totalPages: Math.ceil(count / dto.size),
      };
    } catch (error) {
      this.logger.error(`Error when try load tasks`, error);
      this.logger.error(`Payload ${JSON.stringify(dto)}`);
      throw new InternalServerErrorException();
    }
  }
}
