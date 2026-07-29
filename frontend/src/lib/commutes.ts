import type { Commute } from '../types/commute';
import api from './api';

export type CreateCommuteData = {
  origin: { type: 'Point'; coordinates: [number, number]; label?: string };
  destination: { type: 'Point'; coordinates: [number, number]; label?: string };
  departure_time: string;
  days_of_week: string[];
};

export const createCommute = async (
  data: CreateCommuteData,
): Promise<Commute> => {
  const res = await api.post<Commute>('/commutes', data);
  return res.data;
};
