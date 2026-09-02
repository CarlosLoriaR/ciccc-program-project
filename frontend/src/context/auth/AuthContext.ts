import { createContext } from 'react';
import type { User } from '../../types/user';
import type { SignupData } from '../../types/auth';

export type UpdateProfileData = {
  display_name?: string;
  bio?: string;
  interests?: string[];
  avatar_url?: string;
  photos?: string[];
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  updateProfile: async () => {},
  logout: () => {},
});
