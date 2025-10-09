import { Injectable } from '@nestjs/common';

import { TaskRepository } from 'src/database/repositories';
import { DeleteTaskByIdInputDto } from './delete-task-by-id.input.dto';
import { DeleteTaskByIdOutputDto } from './delete-task-by-id.output.dto';

@Injectable()
export class DeleteTaskByIdService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async deleteTaskById(
    dto: DeleteTaskByIdInputDto,
  ): Promise<DeleteTaskByIdOutputDto> {
    await this.taskRepository.deleteById(dto.taskId);
    return null;
  }
}
