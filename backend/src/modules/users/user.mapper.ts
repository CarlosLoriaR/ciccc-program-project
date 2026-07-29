import { IUser } from './user.model';

export interface PrivateUserDTO {
  id: string;
  email: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  home_location?: IUser['home_location'];
  work_location?: IUser['work_location'];
  preferred_modes: string[];
  schedule?: Record<string, unknown>;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  role: string;
  status: string;
  created_at: Date;
}

export interface PublicUserDTO {
  id: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  rating_avg: number;
  rating_count: number;
}

export function toPrivateUser(user: IUser): PrivateUserDTO {
  return {
    id: user._id.toString(),
    email: user.email,
    full_name: user.full_name,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    phone: user.phone,
    home_location: user.home_location,
    work_location: user.work_location,
    preferred_modes: user.preferred_modes,
    schedule: user.schedule,
    is_verified: user.is_verified,
    rating_avg: user.rating_avg,
    rating_count: user.rating_count,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  };
}

export function toPublicUser(user: IUser): PublicUserDTO {
  return {
    id: user._id.toString(),
    full_name: user.full_name,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    rating_avg: user.rating_avg,
    rating_count: user.rating_count,
  };
}
