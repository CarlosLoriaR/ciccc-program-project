import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import ProfileCard from '../components/ProfileCard';
import type { User } from '../types/user';
import type { Commute } from '../types/commute';
import {
  discoverCommutes,
  listMyCommutes,
  type DiscoverCandidate,
} from '../lib/commutes';
import { createMatch, respondToMatch } from '../lib/matches';

// The discover endpoint only returns a subset of the other user's profile
// (name, avatar, bio, interests, rating). ProfileCard only reads those fields,
// so the rest of the User shape is filled with harmless placeholders.
function toCardUser(candidate: DiscoverCandidate): User {
  const partial = candidate.user_id;
  return {
    _id: partial._id,
    email: '',
    full_name: partial.full_name,
    display_name: partial.display_name ?? partial.full_name,
    avatar_url: partial.avatar_url || 'https://placehold.co/200x200',
    home_location: { type: 'Point', coordinates: [0, 0] },
    work_location: { type: 'Point', coordinates: [0, 0] },
    preferred_modes: [],
    rating_avg: partial.rating_avg,
    rating_count: partial.rating_count,
    role: 'user',
    status: 'active',
    created_at: '',
    updated_at: '',
    bio: partial.bio,
    interests: partial.interests,
    total_rides: partial.total_rides,
    photos: partial.photos,
  };
}

const Discover = () => {
  const [myCommute, setMyCommute] = useState<Commute | null>(null);
  const [candidates, setCandidates] = useState<DiscoverCandidate[]>([]);
  const [index, setIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const myCommutes = await listMyCommutes();
        const active = myCommutes[0] ?? null;
        setMyCommute(active);

        if (active) {
          const result = await discoverCommutes(active._id, 10);
          setCandidates(result.items);
        }
      } catch (error) {
        console.error(error);
        toast.error('Could not load nearby commuters.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const current = candidates[index];

  const handleSkip = () => {
    setIndex((i) => i + 1);
  };

  const handleConnect = async () => {
    if (!myCommute || !current || isConnecting) return;
    setIsConnecting(true);
    try {
      if (current.pending_match_id) {
        // They already requested us — "Connect" here accepts it instead of filing a
        // second, duplicate request (which the backend would reject anyway).
        await respondToMatch(current.pending_match_id, 'accept');
        toast.success(
          `You matched with ${current.user_id.display_name || current.user_id.full_name}! You can now chat.`,
        );
      } else {
        await createMatch({
          addressee_id: current.user_id._id,
          requester_commute_id: myCommute._id,
          addressee_commute_id: current._id,
        });
        toast.success('Connection request sent!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Could not complete that action.');
    } finally {
      setIsConnecting(false);
      setIndex((i) => i + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center text-on-surface-variant">Loading...</div>
    );
  }

  if (!myCommute) {
    return (
      <div className="p-4 text-center space-y-3">
        <p className="text-on-surface-variant">
          Set up your commute first so others can find you.
        </p>
        <Link
          to="/onboarding"
          className="inline-block px-6 py-3 rounded-full bg-primary text-white font-bold"
        >
          Set up my commute
        </Link>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="p-4 text-center text-on-surface-variant">
        No more commuters nearby right now — check back later.
      </div>
    );
  }

  return (
    <div className="p-4">
      <ProfileCard
        user={toCardUser(current)}
        commute={{ ...current, user_id: current.user_id._id }}
        onSkip={handleSkip}
        onConnect={handleConnect}
      />
    </div>
  );
};

export default Discover;
