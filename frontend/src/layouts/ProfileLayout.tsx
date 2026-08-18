import { Outlet } from 'react-router';
import BottomNav from '../components/BottomNav';
import ProfileHeader from '../components/userProfile/ProfileHeader';

const ProfileLayout = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface">
      <div className="shrink-0">
        <ProfileHeader />
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

export default ProfileLayout;
