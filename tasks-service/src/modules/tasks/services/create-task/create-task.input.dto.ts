import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export type CreateTaskInputDto = {
  title: string;
  description?: string;
  deadline: Date;
  priority: TaskPriorityEnum;
  status: TaskStatusEnum;
  users: {
    id: string;
    name: string;
  }[];
};
