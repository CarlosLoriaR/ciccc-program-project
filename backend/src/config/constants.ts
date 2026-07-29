export const COMMUTE_MODES = ['walk', 'bike', 'car', 'bus', 'subway', 'train', 'ferry'] as const;
export type CommuteMode = (typeof COMMUTE_MODES)[number];

export const DAYS_OF_WEEK = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const COMMUTE_DIRECTIONS = ['to_destination', 'to_origin', 'round_trip'] as const;
export type CommuteDirection = (typeof COMMUTE_DIRECTIONS)[number];

export const MATCH_STATUSES = ['pending', 'accepted', 'declined', 'cancelled'] as const;
export type MatchStatus = (typeof MATCH_STATUSES)[number];

export const RIDE_STATUSES = ['scheduled', 'in_progress', 'completed', 'cancelled'] as const;
export type RideStatus = (typeof RIDE_STATUSES)[number];

export const BOOKING_STATUSES = [
  'requested',
  'confirmed',
  'declined',
  'cancelled',
  'completed',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const NOTIFICATION_TYPES = [
  'match_request',
  'match_accepted',
  'new_message',
  'ride_booking',
  'ride_update',
  'review_received',
  'system',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export const REPORT_STATUSES = ['open', 'reviewing', 'resolved', 'dismissed'] as const;
export type ReportStatus = (typeof REPORT_STATUSES)[number];

export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ['active', 'suspended', 'deleted'] as const;
export type UserStatus = (typeof USER_STATUSES)[number];
