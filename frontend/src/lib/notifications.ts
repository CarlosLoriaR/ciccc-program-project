import type { Notification } from '../types/notifications';
import api from './api';

export type PagedNotifications = {
  items: Notification[];
  page: number;
  limit: number;
  total: number;
};

export const listNotifications = async (): Promise<PagedNotifications> => {
  const res = await api.get<PagedNotifications>('/notifications');
  return res.data;
};

export const markNotificationRead = async (
  id: string,
): Promise<Notification> => {
  const res = await api.patch<Notification>(`/notifications/${id}/read`);
  return res.data;
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};

export const removeNotifications = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
