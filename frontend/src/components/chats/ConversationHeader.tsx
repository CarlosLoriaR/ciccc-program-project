import { useNavigate } from 'react-router';
import { MdKeyboardArrowLeft } from 'react-icons/md';

type ConversationHeaderProps = {
  name: string;
  avatarUrl?: string;
};

const ConversationHeader = ({ name, avatarUrl }: ConversationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant bg-surface-container-low">
      <button
        onClick={() => navigate('/chats')}
        className="text-primary hover:text-secondary transition-colors"
      >
        <MdKeyboardArrowLeft size={22} />
      </button>

      <img
        src={avatarUrl || 'https://placehold.co/100x100'}
        alt={name}
        className="w-9 h-9 rounded-full object-cover"
      />
      <p className="font-semibold text-on-surface">{name}</p>
    </header>
  );
};

export default ConversationHeader;
