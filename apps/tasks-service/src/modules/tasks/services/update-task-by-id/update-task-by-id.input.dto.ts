import { TaskPriorityEnum, TaskStatusEnum } from 'src/shared/enums';

export type UpdateTaskByIdInputDto = {
  taskId: string;
  task: {
    title: string;
    description?: string;
    deadline: Date;
    priority: TaskPriorityEnum;
    status: TaskStatusEnum;
  };
};
