import { Outlet } from 'react-router';
import BottomNav from '../components/BottomNav';
import ProfileHeader from '../components/userProfile/ProfileHeader';
import { useState } from 'react';
import CompleteProfileModal from '../components/userProfile/CompleteProfileModal';

const ProfileLayout = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-surface">
      <div className="shrink-0">
        <ProfileHeader onEditClick={() => setIsEditOpen(true)} />
      </div>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <div className="shrink-0">
        <BottomNav />
      </div>

      {isEditOpen && (
        <CompleteProfileModal onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};

export default ProfileLayout;
