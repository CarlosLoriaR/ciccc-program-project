import type { User } from '../types/user';
import type { Commute } from '../types/commute';
import { FiMapPin, FiStar, FiX } from 'react-icons/fi';
import { FaRegCircle } from 'react-icons/fa6';
import { LuMessageCircleMore } from 'react-icons/lu';
import { IoCarSport } from 'react-icons/io5';

type ProfileCardProps = {
  user: User;
  commute: Commute;
  onSkip: () => void;
  onConnect: () => void;
};

const ProfileCard = ({
  user,
  commute,
  onSkip,
  onConnect,
}: ProfileCardProps) => {
  return (
    <div className="rounded-lg border border-outline-variant overflow-hidden bg-white mx-auto md:w-[92%]">
      {/* Img + name */}
      <div className="relative h-96">
        <img
          src={user.avatar_url}
          alt={user.display_name}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h2 className="text-2xl font-bold">{user.display_name}</h2>
          {user.rating_avg >= 4.5 && (
            <span className="text-sm">✓ Top Commuter</span>
          )}
        </div>
      </div>
      {/* Route */}
      <div className="m-4 p-4 rounded-md bg-surface-container-2 flex justify-between items-center">
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <FaRegCircle className="text-primary" size={14} />
            <div className="w-0.5 flex-1 bg-outline-variant my-1.5" />
            <FiMapPin className="text-primary" size={16} />
          </div>

          <div>
            <p className="text-xs text-primary font-bold">FROM</p>
            <p className="font-bold text-on-surface text-2xl">
              {commute.origin.label}
            </p>
            <p className="text-xs text-primary font-bold mt-2">TO</p>
            <p className="font-bold text-on-surface text-2xl">
              {commute.destination.label}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-primary font-bold">DEPARTS</p>
          <p className="font-bold text-primary text-2xl">
            {commute.departure_time}
          </p>
        </div>
      </div>
      {/* Bio */}
      {user.bio && (
        <p className="px-4 text-on-surface-variant font-semibold">{user.bio}</p>
      )}
      {/* Interests */}
      {user.interests && (
        <div className="flex flex-wrap gap-2 p-4">
          {user.interests.map((interest) => (
            <span
              key={interest}
              className="px-3 py-1 rounded-full bg-surface-container text-primary text-sm font-semibold"
            >
              {interest}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mx-5 pt-4 border-t border-outline-variant flex justify-between items-center">
        {user.total_rides !== undefined && (
          <span className="flex items-center gap-2 text-primary font-semibold">
            <IoCarSport size={20} />
            {user.total_rides} Rides
          </span>
        )}
        <span className="flex items-center gap-2 text-primary font-semibold">
          <FiStar size={18} className="fill-primary" />
          {user.rating_avg} Rating
        </span>
      </div>

      {/* Btn Actions */}
      <div className="p-4 flex gap-3 md:gap-20 justify-center">
        <button
          onClick={onSkip}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 rounded-full border border-outline text-primary font-semibold hover:bg-error hover:text-on-error transition-colors"
        >
          <FiX size={18} />
          Skip
        </button>
        <button
          onClick={onConnect}
          className="flex-2 md:flex-none flex items-center justify-center gap-2 px-10 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-container hover:text-on-primary transition-colors"
        >
          <LuMessageCircleMore size={18} />
          Connect
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
