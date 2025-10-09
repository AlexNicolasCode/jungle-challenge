import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export type LoadTasksOutputDto = {
  count: number;
  tasks: Array<{
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
};
