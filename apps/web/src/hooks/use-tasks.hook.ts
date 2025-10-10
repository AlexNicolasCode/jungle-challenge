import { useContext } from "react";

import { TasksContext, TasksContextType } from "../contexts";

export const useTasks = (): TasksContextType => {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};