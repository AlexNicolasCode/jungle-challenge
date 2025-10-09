import { PaginationOutput } from 'src/shared/dtos';
import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export type LoadTasksOutputDto = PaginationOutput<{
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
}>;
