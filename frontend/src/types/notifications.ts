export type NotificationType =
  | 'match_request'
  | 'match_accepted'
  | 'new_message'
  | 'ride_booking'
  | 'ride_update'
  | 'reviwe_recived'
  | 'system';

export type Notification = {
  _id: string;
  user_id: string;
  type: NotificationType;
  title?: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
};
