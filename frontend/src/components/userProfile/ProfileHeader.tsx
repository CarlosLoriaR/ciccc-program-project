import { FaUsers, FaEdit } from 'react-icons/fa';

type ProfileHeaderProps = {
  onEditClick: () => void;
};

const ProfileHeader = ({ onEditClick }: ProfileHeaderProps) => {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-outline-variant bg-surface-container-low">
      <div className="flex items-center gap-2">
        <FaUsers size={30} className="text-primary" />
        <span className="text-[1.5rem] font-bold text-primary">My Profile</span>
      </div>

      <button
        onClick={onEditClick}
        className="text-primary hover:text-secondary transition-colors"
      >
        <FaEdit size={25} />
      </button>
    </header>
  );
};

export default ProfileHeader;
