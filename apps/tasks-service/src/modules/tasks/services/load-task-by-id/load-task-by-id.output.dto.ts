import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export type LoadTaskByIdOutputDto = {
  id: string;
  title: string;
  deadline: Date;
  description?: string;
  priority: TaskPriorityEnum;
  status: TaskStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  users: {
    id: string;
    name: string;
  }[];
} | null;
