import { ReactNode } from "react";

import { TaskEntity } from "../../shared/types";

export interface TasksContextType {
  tasks: TaskEntity[];
  loading: boolean;
  error?: string;
  loadTasks: () => Promise<void>;
  handleNextPage: () => void;
  loadTaskById: (taskId: string) => Promise<TaskEntity | undefined>;
  createTask: (data: Omit<TaskEntity, 'id'>) => Promise<TaskEntity | undefined>;
  updateTask: (taskId: string, data: Partial<Omit<TaskEntity, 'id'>>) => Promise<TaskEntity | undefined>;
  deleteTask: (taskId: string) => Promise<void>;
}

export type TaskProviderProps = {
  children: ReactNode;
}
