import type { User } from '../types/user';
import type { Commute } from '../types/commute';
import { FiMapPin, FiStar, FiX } from 'react-icons/fi';
import { FaRegCircle } from 'react-icons/fa6';
import { LuMessageCircleMore } from 'react-icons/lu';
import { IoCarSport } from 'react-icons/io5';
import { useState } from 'react';
import { formatTime } from '../utils/formatTime';
import { shortenLocationLabel } from '../utils/formatLocation';
import { FaCalendarAlt } from 'react-icons/fa';
import {
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';

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
  const photos = [user.avatar_url, ...(user.photos ?? [])].filter(Boolean);
  console.log('photos array', photos);
  const [photoIndex, setPhotoIndex] = useState(0);

  const goNext = () => {
    setPhotoIndex((i) => (i + 1) % photos.length);
  };

  const goPrev = () => {
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length);
  };
  return (
    <div className="rounded-lg border border-outline-variant overflow-hidden bg-white mx-auto md:w-2xl">
      {/* Imgs + name */}
      <div className="relative h-96">
        <img
          src={photos[photoIndex]}
          alt={user.display_name}
          className="w-full h-full object-cover"
        />

        {photos.length > 1 && (
          <div className="absolute top-2 left-2 right-2 flex gap-1">
            {photos.map((_, i) => (
              <div
                key={i}
                className="flex-1 h-1 rounded-full bg-white/40 overflow-hidden"
              >
                <div
                  className={`h-full bg-white transition-all ${
                    i <= photoIndex ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-white/60 hover:text-secondary transition-colors z-10"
            >
              <MdOutlineKeyboardArrowLeft size={22} />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-1.5 hover:bg-white/60 hover:text-secondary transition-colors z-10"
            >
              <MdOutlineKeyboardArrowRight size={22} />
            </button>
          </>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <h2 className="text-2xl font-bold">{user.display_name}</h2>
          {user.rating_avg >= 4.5 && (
            <span className="text-sm">✓ Top Commuter</span>
          )}
        </div>
      </div>

      {/* Route */}
      <div className="m-4 p-4 rounded-md bg-surface-container-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <div className="flex flex-col items-center pt-1">
              <FaRegCircle className="text-primary" size={14} />
              <div className="w-0.5 flex-1 bg-outline-variant my-1.5" />
              <FiMapPin className="text-primary" size={16} />
            </div>

            <div>
              <p className="text-xs text-primary font-bold">FROM</p>
              <p className="font-bold text-on-surface text-2xl">
                {shortenLocationLabel(commute.origin.label)}
              </p>
              <p className="text-xs text-primary font-bold mt-2">TO</p>
              <p className="font-bold text-on-surface text-2xl">
                {shortenLocationLabel(commute.destination.label)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-primary font-bold">DEPARTS</p>
            <p className="font-bold text-primary text-2xl">
              {formatTime(commute.departure_time)}
            </p>
          </div>
        </div>

        {commute.days_of_week && commute.days_of_week.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/50">
            <FaCalendarAlt size={14} className="text-primary" />
            <span className="font-semibold">
              {commute.days_of_week
                .map((day) => day.charAt(0).toUpperCase() + day.slice(1, 3))
                .join(', ')}
            </span>
          </div>
        )}
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
