import { ReactNode } from "react";

export type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface TasksContextType {
  tasks: Task[];
  loading: boolean;
  error?: string;
  loadTasks: () => Promise<void>;
  handleNextPage: () => void;
  loadTask: (taskId: string) => Promise<Task | undefined>;
  createTask: (data: Omit<Task, 'id'>) => Promise<Task | undefined>;
  updateTask: (taskId: string, data: Partial<Omit<Task, 'id'>>) => Promise<Task | undefined>;
  deleteTask: (taskId: string) => Promise<void>;
}

export type TaskProviderProps = {
  children: ReactNode;
}
