import { Injectable } from '@nestjs/common';

import { TaskRepository } from 'src/database/repositories';
import { UpdateTaskByIdInputDto } from './update-task-by-id.input.dto';
import { UpdateTaskByIdOutputDto } from './update-task-by-id.output.dto';

@Injectable()
export class UpdateTaskByIdService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async updateTaskById(
    dto: UpdateTaskByIdInputDto,
  ): Promise<UpdateTaskByIdOutputDto> {
    await this.taskRepository.updateById(dto);
    return null;
  }
}
