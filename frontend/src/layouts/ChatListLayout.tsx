import { Outlet } from 'react-router';
import ChatListHeader from '../components/chats/ChatListHeader';
import BottomNav from '../components/BottomNav';

const ChatListLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface">
      <div className="shrink-0">
        <ChatListHeader />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default ChatListLayout;
