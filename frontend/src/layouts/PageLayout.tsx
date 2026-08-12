import { Outlet } from 'react-router';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const PageLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface">
      <div className="shrink-0">
        <Header />
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

export default PageLayout;
