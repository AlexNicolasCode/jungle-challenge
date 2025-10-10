import React, { useCallback, useEffect, useRef, useState } from 'react';

import { NotificationContext } from './notification.context';
import { NotificationProviderProps, NotificationType } from './notification.types';
import { ToastNotification } from '../../components';

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket('wss://localhost');
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };
    wsRef.current.onmessage = (event: MessageEvent<string>) => {
      try {
        const notification: NotificationType = JSON.parse(event.data);
        addNotification(notification);
      } catch (error) {
        console.error('Failed to parse WebSocket message', error);
      }
    };
    wsRef.current.onerror = error => {
      console.error('WebSocket error:', error);
    };
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
    };
    return () => {
      wsRef.current?.close();
    };
  }, []);

  const addNotification = ({ type, taskTitle }: NotificationType) => {
    setNotifications(prev => [...prev, { type, taskTitle }]);
  };

  const renderNotification = useCallback(() => {
    const lastNotification = notifications[notifications.length - 1];
    if (!lastNotification) {
      return;
    }
    return <ToastNotification type={lastNotification.type} taskTitle={lastNotification.taskTitle} />
  }, [notifications])

  return (
    <NotificationContext.Provider
      value={{ renderNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
