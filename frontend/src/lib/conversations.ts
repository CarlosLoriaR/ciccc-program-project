import api from './api';
import type { Conversation, Message } from '../types/chat';

export const conversationList = async (): Promise<
  {
    conversation: Conversation;
    lastMessage: Message | null;
  }[]
> => {
  const res = await api.get('/conversations');
  return res.data;
};

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
