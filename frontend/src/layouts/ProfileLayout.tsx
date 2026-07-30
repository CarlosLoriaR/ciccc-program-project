import { Outlet } from 'react-router';
import BottomNav from '../components/BottomNav';
import ProfileHeader from '../components/userProfile/ProfileHeader';
import { useState } from 'react';
import CompleteProfileModal from '../components/userProfile/CompleteProfileModal';

const ProfileLayout = () => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <ProfileHeader onEditClick={() => setIsEditOpen(true)} />
      <main>
        <Outlet />
      </main>
      <BottomNav />

      {isEditOpen && (
        <CompleteProfileModal onClose={() => setIsEditOpen(false)} />
      )}
    </div>
  );
};

export default ProfileLayout;
