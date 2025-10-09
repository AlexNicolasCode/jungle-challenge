import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export type LoadTaskByIdOutputDto = {
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
};
