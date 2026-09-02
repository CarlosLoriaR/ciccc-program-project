export type ConversationParticipant = {
  _id: string;
  full_name: string;
  display_name?: string;
  avatar_url: string;
};

export type Conversation = {
  _id: string;
  match_id: string;
  participant_ids: ConversationParticipant[];
  last_message_at?: string;
  created_at: string;
};

export type Attachment = {
  url: string;
  type: string;
  size: number;
};

export type Message = {
  _id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  attachments: Attachment[];
  read_by: string[];
  created_at: string;
};
