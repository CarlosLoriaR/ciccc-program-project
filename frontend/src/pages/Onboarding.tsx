import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/auth/useAuth';
import toast from 'react-hot-toast';
import AvatarUpload from '../components/userProfile/AvatarUpload';
import AddressAutocomplete from '../components/AddressAutocomplete';
import { createCommute } from '../lib/commutes';
import type { PlaceSuggestion } from '../lib/geocode';
import WeekDaysSelector from '../components/userProfile/WeekDaysSelector';
import TransportModeSelector from '../components/userProfile/TransportModeSelector';

const Onboarding = () => {
  const { updateProfile } = useAuth();
  const navigate = useNavigate();

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
  const [origin, setOrigin] = useState<PlaceSuggestion | null>(null);
  const [destination, setDestination] = useState<PlaceSuggestion | null>(null);
  const [departureTime, setDepartureTime] = useState('');
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [transportModes, setTransportModes] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avatarPreview) {
      toast.error('Please add a photo.');
      return;
    }

    if (!origin || !destination) {
      toast.error('Please pick your From and To from the suggestions list.');
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

    if (transportModes.length === 0) {
      toast.error('Please select at least one way you get there.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({ avatar_url: avatarPreview });
      await createCommute({
        origin: { type: 'Point', coordinates: origin.coordinates, label: origin.label },
        destination: { type: 'Point', coordinates: destination.coordinates, label: destination.label },
        departure_time: departureTime,
        // Backend expects lowercase day codes ('mon', 'tue', ...); the UI keeps the
        // capitalized labels ('Mon', 'Tue', ...) for display.
        days_of_week: weekDays.map((day) => day.toLowerCase()),
        modes: transportModes.map((mode) => mode.toLowerCase()),
      });
      navigate('/discover');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong setting up your commute.');
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
          <AvatarUpload onFileSelect={setAvatarPreview} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AddressAutocomplete label="From" placeholder="Downtown" onSelect={setOrigin} />

          <AddressAutocomplete label="To" placeholder="Burnaby" onSelect={setDestination} />

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

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              How do you get there?
            </label>
            <TransportModeSelector selected={transportModes} onChange={setTransportModes} />
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
