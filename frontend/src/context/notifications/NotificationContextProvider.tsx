import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../auth/useAuth';
import { useSocket } from '../socket/useSocket';
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../../lib/notifications';
import { NotificationContext } from './NotificationContext';
import type { Notification } from '../../types/notifications';

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      return;
    }

    const load = async () => {
      try {
        const result = await listNotifications();
        setNotifications(
          result.items.filter((n) => n.type !== 'match_request'),
        );
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket) return;

    const handleNew = ({ notification }: { notification: Notification }) => {
      if (notification.type === 'match_request') return;
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.off('notification:new', handleNew);
    socket.on('notification:new', handleNew);

    return () => {
      socket.off('notification:new', handleNew);
    };
  }, [socket]);

  const markAsRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, is_read: true } : n)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, markAsRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContextProvider;
