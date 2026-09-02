import { FiX } from 'react-icons/fi';
import InterestSelector from './InterestSelector';
import { useAuth } from '../../context/auth/useAuth';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import PhotoGalleryUpload from './PhotoGalleryUpload';

const DISMISS_KEY = 'profileReminderDismissed';

type CompleteProfileModalProps = {
  onClose: () => void;
};

const CompleteProfileModal = ({ onClose }: CompleteProfileModalProps) => {
  const { user, updateProfile } = useAuth();
  const [bio, setBio] = useState(user?.bio ?? '');
  const [interests, setInterests] = useState<string[]>(user?.interests ?? []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photos, setPhotos] = useState<string[]>(user?.photos ?? []);
  const [displayName, setDisplayName] = useState(user?.display_name ?? '');

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        bio,
        interests,
        photos,
        display_name: displayName,
      });
      toast.success('Profile updated!');
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-on-surface/40 backdrop-blur-sm px-4 overflow-y-auto"
      onClick={handleDismiss}
    >
      <div
        className=" relative w-full max-w-md md:max-w-4xl bg-white rounded-3xl shadow-xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-on-surface-variant hover:text-primary transition-colors"
        >
          <FiX size={22} />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Complete your profile
          </h1>
          <p className="text-on-surface-variant mt-1">
            Add a bio and interests so others get yo know you.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="">Extra Photos</label>
            <PhotoGalleryUpload photos={photos} onChange={setPhotos} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Display Name
            </label>
            <input
              type="text"
              placeholder="Choose your name for others"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium border border-transparent focus:border-primary focus:outline-none transition-colors placeholder:text-outline placeholder:font-normal"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Bio
            </label>
            <textarea
              placeholder="Tell others a bit about yourself..."
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium border border-transparent focus:border-primary focus:outline-none transition-colors placeholder:text-outline placeholder:font-normal resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Interests
            </label>
            <InterestSelector selected={interests} onChange={setInterests} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-container hover:text-on-primary transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;
