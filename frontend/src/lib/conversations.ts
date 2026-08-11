import api from './api';

export type ConversationSummary = {
  conversation: {
    _id: string;
    match_id: string;
    participant_ids: Array<{ _id: string; full_name: string; display_name?: string; avatar_url?: string }>;
    last_message_at?: string;
  };
  lastMessage: { body: string; sender_id: string; created_at: string } | null;
};

export const listConversations = async (): Promise<ConversationSummary[]> => {
  const res = await api.get<ConversationSummary[]>('/conversations');
  return res.data;
};
