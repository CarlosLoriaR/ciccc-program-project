import { useNavigate } from 'react-router';
import { MdKeyboardArrowLeft } from 'react-icons/md';
import { FiUserX } from 'react-icons/fi';

type ConversationHeaderProps = {
  name: string;
  avatarUrl?: string;
  onUnmatch?: () => void;
};

const ConversationHeader = ({
  name,
  avatarUrl,
  onUnmatch,
}: ConversationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant bg-surface-container-high">
      <button
        onClick={() => navigate('/chats')}
        className="text-primary hover:text-secondary transition-colors md:hidden"
      >
        <MdKeyboardArrowLeft size={22} />
      </button>

      <img
        src={avatarUrl || 'https://placehold.co/100x100'}
        alt={name}
        className="w-9 h-9 rounded-full object-cover"
      />
      <p className="font-semibold text-black flex-1">{name}</p>

      {onUnmatch && (
        <button
          onClick={onUnmatch}
          title="Unmatch"
          className="text-on-surface-variant hover:text-error transition-colors"
        >
          <FiUserX size={20} />
        </button>
      )}
    </header>
  );
};

export default ConversationHeader;
