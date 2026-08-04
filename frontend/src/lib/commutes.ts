import type { Commute } from '../types/commute';
import type { User } from '../types/user';
import api from './api';

export type CreateCommuteData = {
  origin: { type: 'Point'; coordinates: [number, number]; label?: string };
  destination: { type: 'Point'; coordinates: [number, number]; label?: string };
  departure_time: string;
  days_of_week: string[];
  modes: string[];
};

export const createCommute = async (
  data: CreateCommuteData,
): Promise<Commute> => {
  const res = await api.post<Commute>('/commutes', data);
  return res.data;
};

export const listMyCommutes = async (): Promise<Commute[]> => {
  const res = await api.get<Commute[]>('/commutes/me');
  return res.data;
};

export const getCommuteById = async (id: string): Promise<Commute> => {
  const res = await api.get<Commute>(`/commutes/${id}`);
  return res.data;
};

export type DiscoverCandidate = Omit<Commute, 'user_id'> & {
  user_id: User;
  // Set when this candidate already sent ME a pending request — hitting "Connect" on
  // them should accept that request instead of filing a duplicate new one.
  pending_match_id: string | null;
};

export type DiscoverResult = {
  items: DiscoverCandidate[];
  page: number;
  limit: number;
  total: number;
};

export const discoverCommutes = async (
  commuteId: string,
  radiusKm = 10,
): Promise<DiscoverResult> => {
  const res = await api.get<DiscoverResult>('/commutes/discover', {
    params: { commuteId, radiusKm },
  });
  return res.data;
};
