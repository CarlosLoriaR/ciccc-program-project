import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth/useAuth';
import toast from 'react-hot-toast';
import AvatarUpload from '../components/userProfile/AvatarUpload';
import { createCommute } from '../lib/commutes';
import WeekDaysSelector from '../components/userProfile/WeekDaysSelector';

const Onboarding = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarPreview) {
      toast.error('Please add a photo.');
      return;
    }

    if (!origin.trim() || !destination.trim()) {
      toast.error('Please fill in your route.');
      return;
    }

    if (!departureTime) {
      toast.error('Please select a departure time.');
      return;
    }

    if (weekDays.length === 0) {
      toast.error('Please select al least one day.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({ avatar_url: avatarPreview });
      await createCommute({
        origin: { type: 'Point', coordinates: [0, 0], label: origin },
        destination: { type: 'Point', coordinates: [0, 0], label: destination },
        departure_time: departureTime,
        days_of_week: weekDays,
      });
      navigate('/discover');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md md:max-w-3xl bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">
            Set up your commute
          </h1>
          <p className="text-on-surface-variant mt-1">
            Just a few things so others can find you.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <AvatarUpload
            onFileSelect={(file, url) => {
              setAvatarFile(file);
              setAvatarPreview(url);
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              From
            </label>
            <input
              type="text"
              placeholder="Downtown"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium placeholder:text-outline placeholder:font-normal border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              To
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Burnaby"
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium placeholder:text-outline placeholder:font-normal border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Departure Time
            </label>
            <input
              type="time"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Which days?
            </label>
            <WeekDaysSelector selected={weekDays} onChange={setWeekDays} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-full hover:bg-primary-container hover:text-on-primary transition-colors desabled:opacity-50"
          >
            {isSubmitting ? 'Setting up...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
