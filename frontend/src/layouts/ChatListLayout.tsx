import { Outlet } from 'react-router';
import ChatListHeader from '../components/chats/ChatListHeader';
import BottomNav from '../components/BottomNav';

const ChatListLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <ChatListHeader />
      <main>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default ChatListLayout;
