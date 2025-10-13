import { ReactNode } from "react";

export type NotificationType = {
  type: NotificationTypeEnum;
  taskId: string;
  taskTitle: string;
}

export enum NotificationTypeEnum {
    TASK_CREATED = 'task:created',
    TASK_UPDATED = 'task:updated',
    COMMENT_CREATED = 'comment:new',
}

export interface NotificationContextType {
  renderNotifications: () => void;
}

export type NotificationProviderProps = {
  children: ReactNode;
}
