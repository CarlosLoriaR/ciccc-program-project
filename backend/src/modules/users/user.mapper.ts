import { IUser } from './user.model';

export interface PrivateUserDTO {
  _id: string;
  email: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  bio?: string;
  interests: string[];
  photos: string[];
  home_location?: IUser['home_location'];
  work_location?: IUser['work_location'];
  preferred_modes: string[];
  schedule?: Record<string, unknown>;
  is_verified: boolean;
  rating_avg: number;
  rating_count: number;
  total_rides: number;
  role: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicUserDTO {
  _id: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
  bio?: string;
  interests: string[];
  photos: string[];
  rating_avg: number;
  rating_count: number;
  total_rides: number;
}

export function toPrivateUser(user: IUser): PrivateUserDTO {
  return {
    _id: user._id.toString(),
    email: user.email,
    full_name: user.full_name,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    phone: user.phone,
    bio: user.bio,
    interests: user.interests,
    photos: user.photos,
    home_location: user.home_location,
    work_location: user.work_location,
    preferred_modes: user.preferred_modes,
    schedule: user.schedule,
    is_verified: user.is_verified,
    rating_avg: user.rating_avg,
    rating_count: user.rating_count,
    total_rides: user.total_rides,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

export function toPublicUser(user: IUser): PublicUserDTO {
  return {
    _id: user._id.toString(),
    full_name: user.full_name,
    display_name: user.display_name,
    avatar_url: user.avatar_url,
    bio: user.bio,
    interests: user.interests,
    photos: user.photos,
    rating_avg: user.rating_avg,
    rating_count: user.rating_count,
    total_rides: user.total_rides,
  };
}
