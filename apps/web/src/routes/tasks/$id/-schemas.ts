import z from "zod";

import { TaskPriorityEnum, TaskStatusEnum } from "@/shared/enums";

export const editTaskSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  priority: z.nativeEnum(TaskPriorityEnum),
  status: z.nativeEnum(TaskStatusEnum),
});

export type EditTaskForm = z.infer<typeof editTaskSchema>;