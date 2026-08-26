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

type MatchParticipant = {
  _id: string;
  full_name: string;
  display_name?: string;
  avatar_url?: string;
};

// GET /matches populates requester_id/addressee_id, unlike POST /matches above.
export type PopulatedMatch = Omit<Match, 'requester_id' | 'addressee_id'> & {
  requester_id: MatchParticipant;
  addressee_id: MatchParticipant;
};

export const listMatches = async (params?: {
  status?: Match['status'];
  direction?: 'incoming' | 'outgoing';
}): Promise<PopulatedMatch[]> => {
  const res = await api.get<PopulatedMatch[]>('/matches', { params });
  return res.data;
};

export const respondToMatch = async (
  matchId: string,
  action: 'accept' | 'decline',
): Promise<Match> => {
  const res = await api.patch<Match>(`/matches/${matchId}/respond`, { action });
  return res.data;
};

// Withdraws a pending request, or unmatches an existing connection.
export const cancelMatch = async (matchId: string): Promise<void> => {
  await api.delete(`/matches/${matchId}`);
};
