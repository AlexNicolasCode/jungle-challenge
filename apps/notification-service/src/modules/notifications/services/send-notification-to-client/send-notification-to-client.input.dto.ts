export type SendNotificationToClientInputDto = {
  userId: string;
  taskId: string;
  taskTitle: string;
  event: 'task:created' | 'task:updated' | 'comment:new';
};
