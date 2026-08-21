import { useNavigate, useParams } from 'react-router';
import BottomNav from '../components/BottomNav';
import ChatListHeader from '../components/chats/ChatListHeader';
import ConversationHeader from '../components/chats/ConversationHeader';
import ConfirmModal from '../components/ConfirmModal';
import ChatList from '../pages/chats/ChatList';
import ChatConversation from '../pages/chats/ChatConversation';
import { useAuth } from '../context/auth/useAuth';
import { useEffect, useState } from 'react';
import { getConversationById } from '../lib/conversations';
import { cancelMatch } from '../lib/matches';
import { AiOutlineMessage } from 'react-icons/ai';
import toast from 'react-hot-toast';

const ChatsLayout = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [otherName, setOtherName] = useState('');
  const [otherAvatar, setOtherAvatar] = useState<string | undefined>();
  const [matchId, setMatchId] = useState<string | null>(null);
  const [isUnmatchConfirmOpen, setIsUnmatchConfirmOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!conversationId || !user) {
        setOtherName('');
        setOtherAvatar(undefined);
        setMatchId(null);
        return;
      }

      try {
        const data = await getConversationById(conversationId);
        if (cancelled) return;
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
        toast.error('This conversation is no longer available.');
        navigate('/chats');
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [conversationId, user, navigate]);

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
    <div className="h-screen overflow-hidden flex flex-col bg-surface md:flex-row">
      <div className="order-2 md:order-1 shrink-0">
        <BottomNav />
      </div>

      <div className="order-1 md:order-2 flex-1 flex min-w-0 overflow-hidden">
        {/* Conversation list column */}
        <div
          className={`${
            conversationId ? 'hidden md:flex' : 'flex'
          } w-full md:w-[380px] md:shrink-0 md:border-r md:border-outline-variant flex-col min-h-0`}
        >
          <div className="shrink-0">
            <ChatListHeader />
          </div>
          <div className="flex-1 overflow-y-auto min-h-0">
            <ChatList activeConversationId={conversationId} />
          </div>
        </div>

        {/* Conversation preview column */}
        <div
          className={`${
            conversationId ? 'flex' : 'hidden md:flex'
          } flex-1 min-w-0 flex-col min-h-0`}
        >
          {conversationId ? (
            <>
              <div className="shrink-0">
                <ConversationHeader
                  name={otherName}
                  avatarUrl={otherAvatar}
                  onUnmatch={
                    matchId ? () => setIsUnmatchConfirmOpen(true) : undefined
                  }
                />
              </div>
              <ChatConversation conversationId={conversationId} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-on-surface-variant">
              <AiOutlineMessage size={40} className="text-outline" />
              <p className="text-sm">Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>

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

export default ChatsLayout;
