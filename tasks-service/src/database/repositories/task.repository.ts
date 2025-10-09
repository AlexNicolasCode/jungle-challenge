import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';

import { TaskEntity, UserEntity } from '../entities';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

@Injectable()
export class TaskRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(task: {
    title: string;
    description?: string;
    deadline: Date;
    priority: TaskPriorityEnum;
    status: TaskStatusEnum;
    users: {
      id: string;
      name: string;
    }[];
  }): Promise<TaskEntity> {
    return this.dataSource.transaction(async (manager) => {
      const usersIds = task.users.map((u) => u.id);
      const relatedUsers = await this.userRepository.find({
        where: { id: In(usersIds) },
      });
      const updatedUsers = await Promise.all(
        relatedUsers.map((user) => {
          return manager.save(this.userRepository.target, {
            id: user.id,
            name: user.name,
          });
        }),
      );
      const savedTask = await manager.save(this.taskRepository.target, {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        priority: task.priority,
        status: task.status,
        users: updatedUsers,
      });
      return savedTask;
    });
  }

  async loadById(taskId: string): Promise<void> {
    await this.taskRepository.softDelete(taskId);
  }

  async loadAll(): Promise<TaskEntity[]> {
    return this.taskRepository.find({ relations: ['users'] });
  }
}
