import { Outlet, useNavigate, useParams } from 'react-router';
import ConversationHeader from '../components/chats/ConversationHeader';
import ConfirmModal from '../components/ConfirmModal';
import { useAuth } from '../context/auth/useAuth';
import { useEffect, useState } from 'react';
import { getConversationById } from '../lib/conversations';
import { cancelMatch } from '../lib/matches';
import toast from 'react-hot-toast';

const ConversationLayout = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otherName, setOtherName] = useState('');
  const [otherAvatar, setOtherAvatar] = useState<string | undefined>();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isUnmatchConfirmOpen, setIsUnmatchConfirmOpen] = useState(false);

  useEffect(() => {
    if (!conversationId || !user) return;

    const load = async () => {
      try {
        const data = await getConversationById(conversationId);
        setMatchId(data.conversation.match_id);
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

  const performUnmatch = async () => {
    if (!matchId) return;
    try {
      await cancelMatch(matchId);
      toast.success('Unmatched.');
      navigate('/chats');
    } catch (error) {
      console.error(error);
      toast.error('Could not unmatch right now.');
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface-container-low">
      <div className="shrink-0">
        <ConversationHeader
          name={otherName}
          avatarUrl={otherAvatar}
          onUnmatch={matchId ? () => setIsUnmatchConfirmOpen(true) : undefined}
        />
      </div>
      <main className="flex-1 overflow-hidden flex flex-col">
        <Outlet />
      </main>

      {isUnmatchConfirmOpen && (
        <ConfirmModal
          title="Unmatch?"
          message={`This will delete your conversation with ${otherName || 'this person'} and can't be undone.`}
          confirmLabel="Unmatch"
          isDestructive
          onConfirm={performUnmatch}
          onClose={() => setIsUnmatchConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default ConversationLayout;
