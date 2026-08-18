import { useAuth } from '../context/auth/useAuth';
import { FiStar, FiLogOut, FiMapPin, FiCalendar } from 'react-icons/fi';
import { FaEdit, FaEnvelope, FaUser } from 'react-icons/fa';
import { BsFileEarmarkTextFill } from 'react-icons/bs';
import { IoCarSport } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import type { Commute } from '../types/commute';
import { listMyCommutes } from '../lib/commutes';
import { FaRegCircle } from 'react-icons/fa6';
import { FaClock } from 'react-icons/fa6';
import { formatTime } from '../utils/formatTime';
import { shortenLocationLabel } from '../utils/formatLocation';
import { MdEmojiTransportation } from 'react-icons/md';
import EditCommuteModal from '../components/userProfile/EditCommuteModal';
import toast from 'react-hot-toast';
import AvatarUpload from '../components/userProfile/AvatarUpload';
import CompleteProfileModal from '../components/userProfile/CompleteProfileModal';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const [myCommute, setMyCommute] = useState<Commute | null>(null);
  const [isEditCommuteOpen, setIsEditCommuteOpen] = useState(false);
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const commutes = await listMyCommutes();
        setMyCommute(commutes[0] ?? null);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [user]);

  if (!user) return null;

  const handleAvatarChange = async (url: string) => {
    try {
      await updateProfile({ avatar_url: url });
      toast.success('Profile photo updated!');
    } catch (erro) {
      console.error(erro);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-6 md:max-w-3xl">
      <div className="flex flex-col items-center text-center">
        <AvatarUpload
          currentAvatarUrl={user.avatar_url}
          onFileSelect={handleAvatarChange}
        />
        <h2 className="text-xl font-bold text-on-surface mt-3">
          {user.full_name}
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
            <IoCarSport size={22} className="fill-primary mt-0.5" />
            {user.total_rides ?? 0}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-semibold">
            Rides
          </p>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
            <FiStar size={18} className="fill-primary mt-0.5" />
            {user.rating_avg}
          </p>
          <p className="text-xs text-on-surface-variant mt-1 font-semibold">
            Rating
          </p>
        </div>
      </div>

      {/* Photos */}
      {user.photos && user.photos.length > 0 && (
        <div>
          <p className="text-xs font-bold text-on-surface-variant tracking-wide mb-2">
            PHOTOS
          </p>
          <div className="grid grid-cols-3 gap-3">
            {user.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Photo${index + 1}`}
                className="w-full aspect-square object-cover rounded-xl"
              />
            ))}
          </div>
        </div>
      )}

      {/* Personal Info */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-on-surface-variant tracking-wide mb-2">
            PERSONAL INFO
          </p>
          <button
            className="text-primary hover:text-secondary transition-colors"
            onClick={() => setIsEditInfoOpen(true)}
          >
            <FaEdit />
          </button>
        </div>

        <div className="bg-white border border-outline-variant rounded-xl divide-y divide-outline-variant">
          <div className="flex items-start gap-3 p-4">
            <FaUser size={16} className="fill-primary mt-0.5" />
            <div>
              <p className="text-xs text-on-surface-variant">Display Name</p>
              <p className="text-on-surface font-medium">{user.display_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4">
            <FaEnvelope className="fill-primary mt-0.5" />
            <div>
              <p className="text-xs text-on-surface-variant">Email</p>
              <p className="text-on-surface font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4">
            <BsFileEarmarkTextFill size={18} className="text-primary mt-0.5" />
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

      {/* My Route */}

      {myCommute && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-on-surface-variant tracking-wide mb-2">
              MY ROUTE
            </p>
            <button
              onClick={() => setIsEditCommuteOpen(true)}
              className="text-primary hover:text-secondary transition-colors"
            >
              <FaEdit />
            </button>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl p-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex flex-col items-center pt-1">
                <FaRegCircle className="text-primary" size={12} />
                <div className="w-0.5 flex-1 bg-outline-variant my-1.5" />
                <FiMapPin className="text-primary" size={14} />
              </div>

              <div>
                <p className="text-xs text-on-surface-variant ">FROM</p>
                <p className="font-semibold text-on-surface text-2xl">
                  {shortenLocationLabel(myCommute.origin.label)}
                </p>
                <p className="text-xs text-on-surface-variant mt-2">TO</p>
                <p className="font-semibold text-on-surface text-2xl">
                  {shortenLocationLabel(myCommute.destination.label)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-on-surface-variant pt-2 border-t border-outline-variant">
              <FaClock size={14} className="fill-primary" />
              <span>{formatTime(myCommute.departure_time)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <FiCalendar size={14} className="text-primary" />
              <span className="font-medium">
                {myCommute.days_of_week
                  .map((day) => day.charAt(0).toUpperCase() + day.slice(1, 3))
                  .join(', ')}
              </span>
            </div>

            {myCommute.modes && myCommute.modes.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                <MdEmojiTransportation size={20} className="text-primary" />
                <span>
                  {myCommute.modes
                    .map((mode) => mode.charAt(0).toUpperCase() + mode.slice(1))
                    .join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {isEditCommuteOpen && myCommute && (
        <EditCommuteModal
          commute={myCommute}
          onClose={() => setIsEditCommuteOpen(false)}
          onSaved={(updated) => setMyCommute(updated)}
        />
      )}

      {isEditInfoOpen && (
        <CompleteProfileModal onClose={() => setIsEditInfoOpen(false)} />
      )}

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full border border-error text-error font-semibold hover:bg-error hover:text-on-error transition-colors"
      >
        <FiLogOut size={18} />
        Log Out
      </button>
    </div>
  );
};

export default Profile;
