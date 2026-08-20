import { Outlet } from 'react-router';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';

const PageLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col md:flex-row bg-surface ">
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto order-1 md:order-2">
        <div className="shrink-0">
          <Header />
        </div>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <div className="order-2 md:order-1 shrink-0">
        <BottomNav />
      </div>
    </div>
  );
};

export default PageLayout;
