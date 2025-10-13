import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { ToastNotification } from '../../components';
import { useAuth } from '../../hooks';
import { NotificationContext } from './notification.context';
import { NotificationProviderProps, NotificationType } from './notification.types';

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { tokens } = useAuth();
  const [notification, setNotification] = useState<NotificationType | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/notifications', {
        extraHeaders: {
            authorization: `Bearer ${tokens?.accessToken}`,
        }
    });
    socket.on('notifications', (newNotification: NotificationType) => {
      addNotification(newNotification);
    });

    return () => {
        socket.close();
    }
  }, [tokens])

  const addNotification = (newNotification: NotificationType) => {
    if (
        window.location.pathname === `/tasks/${newNotification.taskId}` ||
        notification?.taskId === newNotification.taskId
    ) {
        return;
    }
    setNotification(newNotification);
    setTimeout(() => {
        setNotification(null);
    }, 3000);
  }

  const renderNotifications = useCallback(() => {
    if (!notification) {
        return;
    }
    return <ToastNotification taskId={notification.taskId} type={notification.type} taskTitle={notification.taskTitle} />
  }, [notification])

  return (
    <NotificationContext.Provider
      value={{ renderNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
