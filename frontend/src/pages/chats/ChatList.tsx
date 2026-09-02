import { Link } from 'react-router';
import {
  listConversations,
  type ConversationSummary,
} from '../../lib/conversations';
import { useAuth } from '../../context/auth/useAuth';
import { useSocket } from '../../context/socket/useSocket';
import { useEffect, useState } from 'react';
import type { Message } from '../../types/chat';

type ChatListProps = {
  activeConversationId?: string;
};

const ChatList = ({ activeConversationId }: ChatListProps) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [entries, setEntries] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await listConversations();
        setEntries(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleConversationUpdated = ({
      conversationId,
      lastMessage,
    }: {
      conversationId: string;
      lastMessage: Message;
    }) => {
      setEntries((prev) => {
        const index = prev.findIndex((e) => e.conversation._id === conversationId);
        if (index === -1) return prev; // a brand-new conversation — picked up on next full reload/visit
        const updated = { ...prev[index], lastMessage };
        const rest = prev.filter((_, i) => i !== index);
        return [updated, ...rest]; // bump the most recently active conversation to the top
      });
    };

    socket.on('conversation:updated', handleConversationUpdated);
    return () => {
      socket.off('conversation:updated', handleConversationUpdated);
    };
  }, [socket]);

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
    <div className="divide-y divide-outline-variant">
      {entries.map(({ conversation, lastMessage }) => {
        const otherParticipant = conversation.participant_ids.find(
          (p) => p._id !== user?._id,
        );
        const isActive = conversation._id === activeConversationId;
        return (
          <Link
            to={`/chats/${conversation._id}`}
            key={conversation._id}
            className={`flex items-center gap-3 p-4 transition-colors ${
              isActive
                ? 'bg-primary-container'
                : 'hover:bg-surface-container'
            }`}
          >
            <img
              src={otherParticipant?.avatar_url}
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
