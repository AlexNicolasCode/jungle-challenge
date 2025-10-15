import { Injectable } from '@nestjs/common';

import { LoadTasksService } from '../../services';
import { LoadTasksUseCaseInputDto } from './load-tasks.input.dto';
import { LoadTasksUseCaseOutputDto } from './load-tasks.output.dto';

@Injectable()
export class LoadTasksUseCase {
  constructor(private readonly loadTasksService: LoadTasksService) {}

  async execute(
    dto: LoadTasksUseCaseInputDto,
  ): Promise<LoadTasksUseCaseOutputDto> {
    const { count, tasks } = await this.loadTasksService.loadTasks(dto);
    return {
      list: tasks,
      page: dto.page,
      size: dto.size,
      totalPages: Math.ceil(count / dto.size),
    };
  }
}
