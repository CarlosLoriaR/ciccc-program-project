import { INotification, NotificationModel } from './notification.model';
import { NotificationType } from '../../config/constants';
import { domainEvents } from '../../common/events/eventBus';
import { ForbiddenError, NotFoundError } from '../../common/errors/httpErrors';
import { PageParams, toPagedResult } from '../../common/utils/pagination';

/** Central place any module calls to notify a user — persists it and pushes it over the socket layer. */
export async function notify(
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<INotification> {
  const notification = await NotificationModel.create({ user_id: userId, type, title, body, data });
  domainEvents.emit('notification:created', notification);
  return notification;
}

export async function listNotifications(userId: string, params: PageParams) {
  const filter = { user_id: userId };
  const [items, total] = await Promise.all([
    NotificationModel.find(filter).sort({ created_at: -1 }).skip(params.skip).limit(params.limit),
    NotificationModel.countDocuments(filter),
  ]);
  return toPagedResult(items, total, params);
}

async function findOwned(notificationId: string, userId: string): Promise<INotification> {
  const notification = await NotificationModel.findById(notificationId);
  if (!notification) throw new NotFoundError('Notification not found');
  if (notification.user_id.toString() !== userId) throw new ForbiddenError('Not your notification');
  return notification;
}

export async function markRead(notificationId: string, userId: string): Promise<INotification> {
  const notification = await findOwned(notificationId, userId);
  notification.is_read = true;
  await notification.save();
  return notification;
}

export async function markAllRead(userId: string): Promise<void> {
  await NotificationModel.updateMany({ user_id: userId, is_read: false }, { $set: { is_read: true } });
}

export async function remove(notificationId: string, userId: string): Promise<void> {
  const notification = await findOwned(notificationId, userId);
  await notification.deleteOne();
}
