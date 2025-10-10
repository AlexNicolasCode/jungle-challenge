import { createContext } from "react";
import { TasksContextType } from "./task.types";

export const TasksContext = createContext<TasksContextType | undefined>(undefined);
