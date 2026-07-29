import { useAuth } from '../context/auth/useAuth';
import { FiStar, FiLogOut } from 'react-icons/fi';
import { FaEnvelope } from 'react-icons/fa';
import { BsFileEarmarkTextFill } from 'react-icons/bs';
import { IoCarSport } from 'react-icons/io5';
import CompleteProfileModal from '../components/userProfile/CompleteProfileModal';

const Profile = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 md:max-w-3xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <img
            src={user.avatar_url || 'https://placehold.co/200x200'}
            alt={user.display_name}
            className="w-28 h-28 rounded-full object-cover border-4 border-primary-container"
          />
        </div>
        <h2 className="text-xl font-bold text-on-surface mt-3">
          {user.display_name || user.full_name}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
            <IoCarSport size={22} className="fill-primary" />
            {user.total_rides ?? 0}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-semibold">
            Rides
          </p>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
            <FiStar size={18} className="fill-primary" />
            {user.rating_avg}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-semibold">
            Rating
          </p>
        </div>
      </div>

      {/* Personal Info */}
      <div>
        <p className="text-xs font-bold text-on-surface-variant tracking-wide mb-2">
          PERSONAL INFO
        </p>
        <div className="bg-white border border-outline-variant rounded-xl divide-y divide-outline-variant">
          <div className="flex items-start gap-3 p-4">
            <FaEnvelope className="fill-primary" />
            <div>
              <p className="text-xs text-on-surface-variant">Email</p>
              <p className="text-on-surface font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4">
            <BsFileEarmarkTextFill size={18} className="text-primary" />
            <div>
              <p className="text-xs text-on-surface-variant">Bio</p>
              <p className="text-on-surface font-medium">
                {user.bio || 'Add a bio to tell others about yourself.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interests */}
      {user.interests && user.interests.length > 0 && (
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wide mb-2">
            INTERESTS
          </p>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 rounded-full bg-surface-container text-primary text-sm font-semibold"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-error text-error font-semibold hover:bg-error hover:text-on-error transition-colors"
      >
        <FiLogOut size={18} />
        Log Out
      </button>
      {/* <CompleteProfileModal /> */}
    </div>
  );
};

export default Profile;
