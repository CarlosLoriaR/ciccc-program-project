import { FaUsers } from 'react-icons/fa';
import Notifications from '../Notifications';

const ChatsHeader = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-low space-y-3">
      <div className="flex items-center gap-2">
        <FaUsers size={25} className="text-primary" />
        <h1 className="text-3xl font-bold text-primary">Chats</h1>
      </div>

      <Notifications />
    </header>
  );
};

export default ChatsHeader;
