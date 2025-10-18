import { Injectable } from '@nestjs/common';

import { TaskRepository } from 'src/database/repositories';
import { LoadTaskByIdInputDto } from './load-task-by-id.input.dto';
import { LoadTaskByIdOutputDto } from './load-task-by-id.output.dto';

@Injectable()
export class LoadTaskByIdService {
  constructor(private readonly taskRepository: TaskRepository) {}

  async loadTaskById(
    dto: LoadTaskByIdInputDto,
  ): Promise<LoadTaskByIdOutputDto> {
    const task = await this.taskRepository.loadById(dto.taskId);
    if (!task) {
      return null;
    }
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      users: task.users.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    };
  }
}
