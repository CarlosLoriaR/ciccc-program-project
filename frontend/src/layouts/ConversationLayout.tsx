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
    if (!conversationId) return;

    const load = async () => {
      try {
        const data = await getConversationById(conversationId);
        const other = data.conversation.participant_ids.find(
          (p: { _id: string }) => p._id !== user?._id,
        );
        setOtherName(other?.display_name || other?.full_name || 'chat');
        setOtherAvatar(other?.avatar_url);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [conversationId, user]);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <ConversationHeader name={otherName} avatarUrl={otherAvatar} />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default ConversationLayout;
