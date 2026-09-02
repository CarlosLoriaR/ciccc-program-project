import { Schema, model, Document, Types } from 'mongoose';
import { NOTIFICATION_TYPES, NotificationType } from '../../config/constants';

export interface INotification extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  type: NotificationType;
  title?: string;
  body?: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: NOTIFICATION_TYPES, required: true },
    title: String,
    body: String,
    data: Schema.Types.Mixed,
    is_read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } },
);

notificationSchema.index({ user_id: 1, created_at: -1 });

export const NotificationModel = model<INotification>('Notification', notificationSchema);
