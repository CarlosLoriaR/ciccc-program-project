import { Link } from 'react-router';
import type { Conversation, Message } from '../../types/chat';
import { conversationList } from '../../lib/conversations';
import { useAuth } from '../../context/auth/useAuth';
import { useEffect, useState } from 'react';

type ConversationEntry = {
  conversation: Conversation;
  lastMessage: Message | null;
};

const ChatList = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ConversationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await conversationList();
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 text-center text-on-surface-variant">Loading...</div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="p-4 text-center text-on-surface-variant">
        No conversations yet. Connect with someone on Discover to start
        chatting!
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto md:max-w-2xl divide-y divide-outline-variant">
      {entries.map(({ conversation, lastMessage }) => {
        const otherParticipant = conversation.participant_ids.find(
          (p) => p._id !== user?._id,
        );
        return (
          <Link
            to={`/chats/${conversation._id}`}
            key={conversation._id}
            className="flex items-center gap-3 p-4 hover:bg-surface-container-low transition-colors"
          >
            <img
              src={
                otherParticipant?.avatar_url || 'https://placehold.co/100x100'
              }
              alt={
                otherParticipant?.display_name || otherParticipant?.full_name
              }
              className="w-14 h-14 rounded-full object-cover"
            />

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-on-surface">
                {otherParticipant?.display_name || otherParticipant?.full_name}
              </p>
              <p className="text-sm text-on-surface-variant truncate">
                {lastMessage ? lastMessage.body : 'Say hi!'}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ChatList;
