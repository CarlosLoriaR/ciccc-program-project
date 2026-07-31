import api from './api';

export type CreateMatchData = {
  addressee_id: string;
  requester_commute_id: string;
  addressee_commute_id: string;
};

export type Match = {
  _id: string;
  requester_id: string;
  addressee_id: string;
  requester_commute_id: string;
  addressee_commute_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  compatibility_score?: number;
};

export const createMatch = async (data: CreateMatchData): Promise<Match> => {
  const res = await api.post<Match>('/matches', data);
  return res.data;
};
