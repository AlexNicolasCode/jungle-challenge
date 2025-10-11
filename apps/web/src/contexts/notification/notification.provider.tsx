import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { ToastNotification } from '../../components';
import { useAuth } from '../../hooks';
import { NotificationContext } from './notification.context';
import { NotificationProviderProps, NotificationType } from './notification.types';

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { tokens } = useAuth();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    const socket = io('http://localhost:3000/notifications', {
        extraHeaders: {
            authorization: `Bearer ${tokens?.accessToken}`,
        }
    });
    socket.on('notifications', (notification: NotificationType) => {
      addNotification(notification);
    });
  }, [])

  const addNotification = ({ type, taskId, taskTitle }: NotificationType) => {
    setNotifications(prev => [...prev, { type, taskId, taskTitle }]);
  };

  const renderNotifications = useCallback(() => {
    const lastNotification = notifications[notifications.length - 1];
    if (!lastNotification) {
      return;
    }
    return <ToastNotification taskId={lastNotification.taskId} type={lastNotification.type} taskTitle={lastNotification.taskTitle} />
  }, [notifications])

  return (
    <NotificationContext.Provider
      value={{ renderNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
