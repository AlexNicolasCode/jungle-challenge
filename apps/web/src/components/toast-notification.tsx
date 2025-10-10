import { useState, useEffect } from 'react';
import { NotificationType, NotificationTypeEnum } from '../contexts/notification';

export const ToastNotification: React.FC<NotificationType> = ({ type, taskTitle }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const messages: Record<NotificationTypeEnum, string> = {
      [NotificationTypeEnum.NEW_COMMENT]: `New comment added to "${taskTitle}"`,
      [NotificationTypeEnum.TASK_CREATED]: `Task "${taskTitle}" has been created`,
      [NotificationTypeEnum.TASK_UPDATED]: `Task "${taskTitle}" has been updated`,
    };
    setMessage(messages[type] || `Notification for "${taskTitle}"`);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, [type, taskTitle]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 transition-all transform ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } bg-blue-600 text-white px-4 py-2 rounded shadow-lg`}
    >
      {message}
    </div>
  );
};
