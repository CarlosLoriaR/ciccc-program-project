import { Outlet } from 'react-router';
import ChatListHeader from '../components/chats/ChatListHeader';
import BottomNav from '../components/BottomNav';

const ChatListLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface md:flex-row">
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto order-1 md:order-2">
        <div className="shrink-0">
          <ChatListHeader />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <div className="order-2 md:order-1">
        <BottomNav />
      </div>
    </div>
  );
};

export default ChatListLayout;
