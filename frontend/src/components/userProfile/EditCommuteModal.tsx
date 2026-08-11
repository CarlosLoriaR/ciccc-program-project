import { FiX } from 'react-icons/fi';
import AddressAutocomplete from '../AddressAutocomplete';
import WeekDaysSelector from './WeekDaysSelector';
import TransportModeSelector from './TransportModeSelector';
import type { Commute } from '../../types/commute';
import { useState } from 'react';
import type { PlaceSuggestion } from '../../lib/geocode';
import { updateCommute } from '../../lib/commutes';
import toast from 'react-hot-toast';

const DISMISS_KEY = 'profileReminderDismissed';

type EditCommuteModalProps = {
  commute: Commute;
  onClose: () => void;
  onSaved: (updated: Commute) => void;
};

const EditCommuteModal = ({
  commute,
  onClose,
  onSaved,
}: EditCommuteModalProps) => {
  const [origin, setOrigin] = useState<PlaceSuggestion | null>(null);
  const [destination, setDestination] = useState<PlaceSuggestion | null>(null);
  const [departureTime, setDepartureTime] = useState(commute.departure_time);
  const [weekDays, setWeekDays] = useState<string[]>(
    commute.days_of_week.map((d) => d.charAt(0).toUpperCase() + d.slice(1, 3)),
  );
  const [transportModes, setTransportModes] = useState<string[]>(
    commute.modes.map((m) => m.charAt(0).toUpperCase() + m.slice(1)),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updated = await updateCommute(commute._id, {
        origin: origin
          ? {
              type: 'Point',
              coordinates: origin.coordinates,
              label: origin.label,
            }
          : undefined,
        destination: destination
          ? {
              type: 'Point',
              coordinates: destination.coordinates,
              label: destination.label,
            }
          : undefined,
        departure_time: departureTime,
        days_of_week: weekDays.map((d) => d.toLowerCase()),
        modes: transportModes.map((m) => m.toLowerCase()),
      });
      toast.success('Route updated!');
      onSaved(updated);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Could not update your route.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    onClose();
  };

  return (
    <div
      onClick={handleDismiss}
      className="fixed inset-0 z-50 flex items-start justify-center bg-on-surface/40 backdrop-blur-sm px-4 py-10 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md md:max-w-2xl bg-white rounded-3xl shadow-xl p-8"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-5 text-on-surface-variant hover:text-primary transition-colors"
        >
          <FiX size={22} />
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Edit your route</h1>
          <p className="text-on-surface-variant mt-1 text-sm font-semibold">
            Current: {commute.origin.label} → {commute.destination.label}{' '}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AddressAutocomplete
            label="From"
            placeholder="Burnaby"
            onSelect={setOrigin}
          />
          <AddressAutocomplete
            label="To"
            placeholder="Downtown"
            onSelect={setDestination}
          />

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
            <TransportModeSelector
              selected={transportModes}
              onChange={setTransportModes}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Route'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCommuteModal;
