import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import { TaskRepository } from 'src/database/repositories';
import { LoadTasksInputDto } from './load-tasks.input.dto';
import { LoadTasksOutputDto } from './load-tasks.output.dto';
import { TaskEntity } from 'src/database/entities';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

@Injectable()
export class LoadTasksService {
  private readonly logger = new Logger(LoadTasksService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async loadTasks(dto: LoadTasksInputDto): Promise<LoadTasksOutputDto> {
    try {
      const { count, tasks } = await this.taskRepository.loadAll({
        page: dto.page,
        size: dto.size,
        where: {
          title: dto.title,
          deadline: dto.deadline,
          priority: dto.priority,
          status: dto.status,
          usersIds: dto.usersIds,
        },
      });
      return { count, tasks: this.formatTasks(tasks) };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  private formatTasks(tasks: TaskEntity[]): Array<{
    title: string;
    deadline: Date;
    priority: TaskPriorityEnum;
    status: TaskStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    users: {
      id: string;
      name: string;
    }[];
  }> {
    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      deadline: task.deadline,
      priority: task.priority,
      status: task.status,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
      users: task.users.map((user) => ({
        id: user.id,
        name: user.name,
      })),
    }));
  }
}
