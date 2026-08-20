import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import type { Notification } from '../types/notifications';
import { useNotifications } from '../context/notifications/useNotifications';
import { FaBell } from 'react-icons/fa6';
import { IoIosMailOpen } from 'react-icons/io';

const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}s ago`;
};

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification._id);
    }

    const conversationId = notification.data?.conversationId as
      | string
      | undefined;
    if (conversationId) {
      navigate(`/chats/${conversationId}`);
      setIsOpen(false);
      return;
    }

    if (notification.type === 'match_accepted') {
      navigate('/chats');
    }
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative text-primary hover:text-secondary transition-colors"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-error text-on-error text-[10px] font-bold rounded-full min-w-4 h-4 px-1 flex items-center justify-center">
            {unreadCount > 10 ? '10+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-surface-container-low border border-outline-variant rounded-2xl shadow-xl z-[1000] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
            <p className="font-bold text-on-surface">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-primary hover:text-secondary transition-colors flex items-start "
              >
                <IoIosMailOpen size={16} />
                Mark All As Read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-on-surface-variant py-8">
                No notifications yet.
              </p>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification._id}
                  type="button"
                  onClick={() => handleNotificationClick(notification)}
                  className={`w-full text-left px-4 py-3 border-b border-outline-variant last:border-0  transition-colors ${notification.is_read ? '' : 'bg-surface-container-highest'}`}
                >
                  <div className="flex items-start gap-2">
                    {!notification.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    )}

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">
                        {notification.title}
                      </p>
                      <p className="text-sm text-on-surface-variant mt-0.5">
                        {notification.body}
                      </p>
                      <p className="text-xs text-outline mt-1">
                        {timeAgo(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
