import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { User } from '../../types/user';
import type { SignupData } from '../../types/auth';
import type { UpdateProfileData } from './AuthContext';
import api from '../../lib/api';
import toast from 'react-hot-toast';

// ⚠️ TEMPORAL: mock para probar pantallas sin backend. Sacar cuando conectemos la API real.
const MOCK_USER: User = {
  _id: '1',
  email: 'jane@example.com',
  full_name: 'Jane Doe',
  display_name: 'Jane',
  avatar_url:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmIUHezoShRZ9jroRwTSttj52ou3HpCmXi-wSVSFoBaQ&s=10',
  home_location: { type: 'Point', coordinates: [0, 0] },
  work_location: { type: 'Point', coordinates: [0, 0] },
  preferred_modes: [],
  rating_avg: 4.9,
  rating_count: 50,
  role: 'user',
  status: 'active',
  created_at: '',
  updated_at: '',
  bio: 'Entusiasta del carpooling y amante de la tecnología.',
  interests: ['Coding', 'Music', 'Travel', 'Movies'],
  total_rides: 42,
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  // MOCK, RECUERDA CAMBIAR A (null) DESPUÉS
  const [user, setUser] = useState<User | null>(MOCK_USER);
  // MOCK, RECUERDA CAMBIAR A (localStorage.getItem('token')) DESPUÉS
  const [token, setToken] = useState<string | null>('mock-tocken');

  // MOCK, RECUERDA CAMBIAR A TRUE DESPUÉS
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //   if (!token) {
    //     setIsLoading(false);
    //     return;
    //   }
    //   const fetchUser = async () => {
    //     try {
    //       const res = await api.get<User>('auth/me');
    //       setUser(res.data);
    //     } catch (error) {
    //       console.error(error);
    //       localStorage.removeItem('token');
    //       setToken(null);
    //       setUser(null);
    //     } finally {
    //       setIsLoading(false);
    //     }
    //   };
    //   fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post<{ user: User; token: string }>('auth/login', {
        email,
        password,
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
    } catch (error) {
      console.error(error);
      toast.error('Login failed. Check your credentials.');
      throw error;
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const res = await api.post<{ user: User; token: string }>(
        'auth/signup',
        data,
      );
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
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
