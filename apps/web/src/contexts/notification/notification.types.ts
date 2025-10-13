import { ReactNode } from "react";

export type NotificationType = {
  type: NotificationTypeEnum;
  taskId: string;
  taskTitle: string;
}

export enum NotificationTypeEnum {
  NEW_COMMENT = 'COMMENT_CREATED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_UPDATED = 'TASK_UPDATED',
}

export interface NotificationContextType {
  renderNotifications: () => void;
}

export type NotificationProviderProps = {
  children: ReactNode;
}
