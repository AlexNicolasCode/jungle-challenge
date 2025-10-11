import { ReactNode } from "react";

import { TaskPriorityEnum, TaskStatusEnum } from "../../shared/enums";
import { CommentEntity, TaskEntity, UserEntity } from "../../shared/types";

export interface TasksContextType {
  tasks: TaskEntity[];
  loading: boolean;
  error?: string;
  loadTasks: () => Promise<void>;
  handleNextPage: () => void;
  loadTaskById: (taskId: string) => Promise<TaskEntity | undefined>;
  createTask: (data: {
    title: string;
    description?: string;
    deadline: string;
    priority: TaskPriorityEnum;
    status: TaskStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    users: UserEntity[];
  }) => Promise<void>;
  updateTask: (taskId: string, data: {
    title: string;
    description?: string;
    deadline: string;
    priority: TaskPriorityEnum;
    status: TaskStatusEnum;
    createdAt: Date;
    updatedAt: Date;
    users: UserEntity[];
  }) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  loadCommentsByTaskId: (taskId: string) => Promise<CommentEntity[]>;
  createCommentByTaskId: (params: { taskId: string; content: string }) => Promise<void>;
}

export type TaskProviderProps = {
  children: ReactNode;
}
