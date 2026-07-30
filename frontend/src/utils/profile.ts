import type { User } from '../types/user';

export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return true;

  return Boolean(
    user.bio &&
    user.interests &&
    user.interests.length > 0 &&
    user.photos &&
    user.photos.length > 0,
  );
};
