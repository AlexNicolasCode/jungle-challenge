import { Injectable } from '@nestjs/common';

import { LoadTasksInputDto } from '../dtos/inputs';
import { LoadTasksOutputDto } from '../dtos/outputs';
import { LoadTasksService } from '../services';

@Injectable()
export class LoadTasksUseCase {
  constructor(private readonly loadTasksService: LoadTasksService) {}

  async execute(dto: LoadTasksInputDto): Promise<LoadTasksOutputDto> {
    const { count, tasks } = await this.loadTasksService.loadTasks(dto);
    return {
      list: tasks,
      page: dto.page,
      size: dto.size,
      totalPages: Math.ceil(count / dto.size),
    };
  }
}
