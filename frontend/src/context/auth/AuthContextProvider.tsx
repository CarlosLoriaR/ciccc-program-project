import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../../types/user';
import type { SignupData } from '../../types/auth';
import type { UpdateProfileData } from './AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  // Only "loading" if there's a token to actually validate.
  const [isLoading, setIsLoading] = useState<boolean>(() => !!localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await api.get<User>('/users/me');
        setUser(res.data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ user: User; accessToken: string }>('/auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Check your credentials.');
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const res = await api.post<{ user: User; accessToken: string }>(
        '/auth/register',
        data,
      );
      localStorage.setItem('token', res.data.accessToken);
      setToken(res.data.accessToken);
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      toast.error('Signup failed. Check your credentials.');
      throw error;
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      const res = await api.patch<User>('/users/me', data);
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Could not update profile. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => {
      // best-effort — the server-side session will still expire on its own
    });
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        signup,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
