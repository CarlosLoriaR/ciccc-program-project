import { Link } from 'react-router';
// import type { Conversation, Message } from '../../types/chat';
import {
  listConversations,
  type ConversationSummary,
} from '../../lib/conversations';
import { useAuth } from '../../context/auth/useAuth';
import { useEffect, useState } from 'react';
// import { MOCK_CONVERSATIONS } from '../../constants/chatMocks';

// type ConversationEntry = {
//   conversation: Conversation;
//   lastMessage: Message | null;
// };

const ChatList = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // if (!user) {
    //   setIsLoading(false);
    //   return;
    // }

    // // ⚠️ TEMPORAL: mock en vez de conversationList() real
    // const mockEntries: ConversationEntry[] = MOCK_CONVERSATIONS.map((mock) => ({
    //   conversation: {
    //     _id: mock.id,
    //     match_id: `match-${mock.id}`,
    //     participant_ids: [
    //       {
    //         _id: user._id,
    //         full_name: user.full_name,
    //         display_name: user.display_name,
    //         avatar_url: user.avatar_url,
    //       },
    //       mock.otherUser,
    //     ],
    //     created_at: new Date().toISOString(),
    //   },
    //   lastMessage: {
    //     _id: `msg-${mock.id}`,
    //     conversation_id: mock.id,
    //     sender_id: mock.lastMessageSender,
    //     body: mock.lastMessageBody,
    //     attachments: [],
    //     read_by: [],
    //     created_at: new Date().toISOString(),
    //   },
    // }));

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

    // setEntries(mockEntries);
    // setIsLoading(false);
  }, []); //para el mock lleva [user]

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
    <div className="max-w-md mx-auto md:max-w-2xl divide-y divide-outline-variant ">
      {entries.map(({ conversation, lastMessage }) => {
        const otherParticipant = conversation.participant_ids.find(
          (p) => p._id !== user?._id,
        );
        return (
          <Link
            to={`/chats/${conversation._id}`}
            key={conversation._id}
            className="flex items-center gap-3 p-4 rounded-2xl  hover:bg-surface-container transition-colors"
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
