import { Outlet, useParams } from 'react-router';
import ConversationHeader from '../components/chats/ConversationHeader';
import { useAuth } from '../context/auth/useAuth';
import { useEffect, useState } from 'react';
import { getConversationById } from '../lib/conversations';

const ConversationLayout = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const [otherName, setOtherName] = useState('');
  const [otherAvatar, setOtherAvatar] = useState<string | undefined>();

  useEffect(() => {
    if (!conversationId || !user) return;

    const load = async () => {
      try {
        const data = await getConversationById(conversationId);
        const other = data.conversation.participant_ids.find(
          (p) => p._id !== user?._id,
        );

        if (other) {
          setOtherName(other.display_name || other.full_name || 'Chat');
          setOtherAvatar(other.avatar_url);
        }
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [conversationId, user]);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface-container-low">
      <div className="shrink-0">
        <ConversationHeader name={otherName} avatarUrl={otherAvatar} />
      </div>
      <main className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default ConversationLayout;
