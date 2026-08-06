import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import toast from 'react-hot-toast';
import { FiMapPin, FiClock, FiUserPlus } from 'react-icons/fi';
import { FaRegCircle } from 'react-icons/fa6';
import { LuMessageCircleMore, LuUsers } from 'react-icons/lu';
import 'leaflet/dist/leaflet.css';
import type { Commute } from '../types/commute';
import { discoverCommutes, getCommuteById, listMyCommutes } from '../lib/commutes';
import { listMatches, type PopulatedMatch } from '../lib/matches';
import { listConversations } from '../lib/conversations';
import { useAuth } from '../context/auth/useAuth';
import { distanceKm } from '../lib/geo';
import { selfIcon, candidateIcon } from '../lib/mapIcons';

const RADIUS_KM = 10;

type MatchedPin = {
  matchId: string;
  conversationId: string | null;
  otherUser: PopulatedMatch['requester_id'];
  commute: Commute;
};

const Map = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myCommute, setMyCommute] = useState<Commute | null>(null);
  const [possibleMatchesCount, setPossibleMatchesCount] = useState(0);
  const [matchedPins, setMatchedPins] = useState<MatchedPin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const myCommutes = await listMyCommutes();
        const active = myCommutes[0] ?? null;
        setMyCommute(active);
        if (!active || !user) return;

        const [discoverResult, acceptedMatches, conversations] = await Promise.all([
          discoverCommutes(active._id, RADIUS_KM),
          listMatches({ status: 'accepted' }),
          listConversations(),
        ]);

        setPossibleMatchesCount(discoverResult.total);

        const conversationByMatchId: Record<string, string> = {};
        conversations.forEach((c) => {
          conversationByMatchId[c.conversation.match_id] = c.conversation._id;
        });

        const pins = await Promise.all(
          acceptedMatches.map(async (match): Promise<MatchedPin | null> => {
            const isRequester = match.requester_id._id === user._id;
            const otherUser = isRequester ? match.addressee_id : match.requester_id;
            const otherCommuteId = isRequester ? match.addressee_commute_id : match.requester_commute_id;

            try {
              const commute = await getCommuteById(otherCommuteId);
              return {
                matchId: match._id,
                conversationId: conversationByMatchId[match._id] ?? null,
                otherUser,
                commute,
              };
            } catch {
              return null; // that person's commute may no longer be active — skip it, don't break the map
            }
          }),
        );

        const nearby = pins.filter(
          (pin): pin is MatchedPin =>
            pin !== null &&
            distanceKm(active.origin.coordinates, pin.commute.origin.coordinates) <= RADIUS_KM,
        );
        setMatchedPins(nearby);
      } catch (error) {
        console.error(error);
        toast.error('Could not load the map.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  if (isLoading) {
    return <div className="p-4 text-center text-on-surface-variant">Loading...</div>;
  }

  if (!myCommute) {
    return (
      <div className="p-4 text-center space-y-3">
        <p className="text-on-surface-variant">
          Set up your commute first so you can see the map.
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

  const center: [number, number] = [
    myCommute.origin.coordinates[1],
    myCommute.origin.coordinates[0],
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="h-[60vh] mx-3 mt-3 rounded-lg overflow-hidden border border-outline-variant">
        <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={center} icon={selfIcon}>
            <Popup>You — {myCommute.origin.label}</Popup>
          </Marker>

          {matchedPins.map((pin) => {
            const position: [number, number] = [
              pin.commute.origin.coordinates[1],
              pin.commute.origin.coordinates[0],
            ];
            const displayName = pin.otherUser.display_name || pin.otherUser.full_name;

            return (
              <Marker key={pin.matchId} position={position} icon={candidateIcon}>
                <Popup minWidth={220} maxWidth={260}>
                  <div className="space-y-2 py-0.5">
                    <div className="flex items-center gap-2">
                      <img
                        src={pin.otherUser.avatar_url || 'https://placehold.co/64x64'}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <p className="font-bold text-on-surface">{displayName}</p>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <div className="flex flex-col items-center pt-0.5">
                        <FaRegCircle className="text-primary shrink-0" size={9} />
                        <div className="w-px flex-1 bg-outline-variant my-0.5" />
                        <FiMapPin className="text-primary shrink-0" size={12} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate">{pin.commute.origin.label}</p>
                        <p className="mt-2.5 truncate">{pin.commute.destination.label}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                      <FiClock size={12} />
                      <span>Departs {pin.commute.departure_time}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => pin.conversationId && navigate(`/chat/${pin.conversationId}`)}
                      disabled={!pin.conversationId}
                      className="mt-1 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-full bg-primary text-white text-sm font-bold disabled:opacity-50"
                    >
                      <LuMessageCircleMore size={16} />
                      Chat
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      <div className="m-3 p-4 rounded-lg bg-surface-container-low space-y-2">
        <p className="font-bold text-on-surface">Status</p>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <FiUserPlus className="text-primary shrink-0" size={16} />
          <span>
            {possibleMatchesCount} possible match{possibleMatchesCount === 1 ? '' : 'es'} nearby
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-on-surface-variant">
          <LuUsers className="text-secondary shrink-0" size={16} />
          <span>
            {matchedPins.length} connection{matchedPins.length === 1 ? '' : 's'} nearby
          </span>
        </div>
      </div>
    </div>
  );
};

export default Map;
