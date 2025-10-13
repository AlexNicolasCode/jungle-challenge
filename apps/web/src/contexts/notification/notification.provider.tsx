import React, { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { ToastNotification } from '../../components';
import { useAuth } from '../../hooks';
import { CommentEntity } from '../../shared/types';
import { NotificationContext } from './notification.context';
import { NotificationProviderProps, NotificationType, NotificationTypeEnum } from './notification.types';

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { tokens } = useAuth();
  const [notification, setNotification] = useState<NotificationType | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3000/notifications', {
        extraHeaders: {
            authorization: `Bearer ${tokens?.accessToken}`,
        }
    });
    socket.on('task:updated', (newNotification: NotificationType) => {
      addNotification({
        ...newNotification,
        type: NotificationTypeEnum.TASK_UPDATED,
      });
    });
    socket.on('task:created', (newNotification: NotificationType) => {
      addNotification({
        ...newNotification,
        type: NotificationTypeEnum.TASK_CREATED,
      });
    });
    socket.on('comment:new', (payload: {
      task: {
        id: string;
        title: string;
      };
      comment: CommentEntity;
    }) => {
        addNotification({
            taskId: payload.task.id,
            taskTitle: payload.task.title,
            type: NotificationTypeEnum.COMMENT_CREATED,
        });
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
