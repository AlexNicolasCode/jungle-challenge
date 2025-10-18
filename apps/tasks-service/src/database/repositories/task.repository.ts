import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';
import { TaskEntity, UserEntity } from '../entities';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectDataSource()
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
    const relatedUsers = await Promise.all(
      task.users.map((user) =>
        this.userRepository.save({ id: user.id, name: user.name }),
      ),
    );
    return this.dataSource.transaction(async (manager) => {
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

  async loadById(taskId: string): Promise<TaskEntity | null> {
    return this.taskRepository.findOne({
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        deadline: true,
        description: true,
        users: {
          id: true,
          name: true,
        },
      },
      relations: ['users'],
      where: { id: taskId },
    });
  }

  async updateById(task: {
    id: string;
    title: string;
    description?: string;
    deadline: Date;
    priority: TaskPriorityEnum;
    status: TaskStatusEnum;
  }): Promise<void> {
    await this.taskRepository.update({ id: task.id }, task);
  }

  async deleteById(taskId: string): Promise<void> {
    await this.taskRepository.softDelete(taskId);
  }

  async loadAll({
    page,
    size,
    where,
  }: {
    page: number;
    size: number;
    where: {
      deadline?: Date;
      priority?: TaskPriorityEnum;
      status?: TaskStatusEnum;
      search?: string;
      usersIds?: string[];
    };
  }): Promise<{ tasks: TaskEntity[]; count: number }> {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.users', 'user');
    const skip = (page - 1) * size;
    query.skip(skip);
    query.take(size);
    const users = where.usersIds;
    const hasUsers = users && users.length > 0;
    if (hasUsers) {
      query.andWhere('user.id IN (:...usersIds)', { usersIds: where.usersIds });
    }
    const fieldMapper: Record<
      string,
      { query: string; variables: Record<string, any> }
    > = {
      search: {
        query: 'task.title ILIKE :search',
        variables: { search: `%${where.search}%` },
      },
      deadline: {
        query: 'task.deadline = :deadline',
        variables: { deadline: where.deadline },
      },
      priority: {
        query: 'task.priority = :priority',
        variables: { priority: where.priority },
      },
      status: {
        query: 'task.status = :status',
        variables: { status: where.status },
      },
    };
    const fields: string[] = Object.keys(where);
    for (const field of fields) {
      const whereParams = fieldMapper[field];
      if (
        !where[field] ||
        !whereParams ||
        !whereParams.query ||
        !whereParams.variables
      ) {
        continue;
      }
      query.andWhere(whereParams.query, whereParams.variables);
    }
    const [tasks, count] = await query.getManyAndCount();
    return { tasks, count };
  }
}
