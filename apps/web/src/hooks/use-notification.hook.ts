import { useContext } from "react";

import { NotificationContext, NotificationContextType } from "../contexts";

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useTasks must be used within a TaskProvider');
  return context;
};