import { CheckCircle2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { NotificationType, NotificationTypeEnum } from '../contexts/notification';
import { Alert, AlertTitle } from './ui/alert';

export const ToastNotification: React.FC<NotificationType> = ({ type, taskTitle }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const messages: Record<NotificationTypeEnum, string> = {
      [NotificationTypeEnum.COMMENT_CREATED]: `New comment added to "${taskTitle}"`,
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
        } px-4 py-2 bg-none`}
    >
        <Alert>
            <CheckCircle2Icon />
            <AlertTitle>{message}</AlertTitle>
        </Alert>
    </div>
  );
};
