import { TaskPriorityEnum, TaskStatusEnum } from "../enums";
import { UserEntity } from "./user";

export type TaskEntity = {
  id: string;
  title: string;
  description?: string;
  deadline: Date;
  priority: TaskPriorityEnum;
  status: TaskStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  users?: UserEntity[];
};
