import { Outlet } from 'react-router';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const PageLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};

export default PageLayout;
