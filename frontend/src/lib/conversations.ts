import api from './api';
import type { Message } from '../types/chat';

export type ConversationSummary = {
  conversation: {
    _id: string;
    match_id: string;
    participant_ids: Array<{
      _id: string;
      full_name: string;
      display_name?: string;
      avatar_url?: string;
    }>;
    last_message_at?: string;
  };
  lastMessage: { body: string; sender_id: string; created_at: string } | null;
};

// export const conversationList = async (): Promise<
//   {
//     conversation: Conversation;
//     lastMessage: Message | null;
//   }[]
// > => {
//   const res = await api.get('/conversations');
//   return res.data;
// };

export const getConversationById = async (id: string) => {
  const res = await api.get(`/conversations/${id}`);
  return res.data;
};

export const listMessages = async (
  conversationId: string,
  before?: string,
  limit = 30,
): Promise<Message[]> => {
  const res = await api.get<Message[]>(
    `/conversations/${conversationId}/messages`,
    {
      params: { before, limit },
    },
  );
  return res.data;
};

export const listConversations = async (): Promise<ConversationSummary[]> => {
  const res = await api.get<ConversationSummary[]>('/conversations');
  return res.data;
};
