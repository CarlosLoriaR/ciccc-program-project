import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/auth/useAuth';
import {
  groupSchedule,
  nextDateForDay,
  type ScheduleEntry,
} from '../utils/schedules';
import type { Commute } from '../types/commute';
import { getCommuteById, listMyCommutes } from '../lib/commutes';
import { listMatches } from '../lib/matches';
import { formatTime } from '../utils/formatTime';
import { FaRegCalendarAlt } from 'react-icons/fa';

const Schedules = () => {
  const { user } = useAuth();
  const [myCommute, setMyCommute] = useState<Commute | null>(null);
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const myCommutes = await listMyCommutes();
        const commute = myCommutes[0] ?? null;
        setMyCommute(commute);
        if (!commute) return;

        const acceptedMatches = await listMatches({ status: 'accepted' });

        if (acceptedMatches.length === 0) {
          const solo = commute.days_of_week.map((day) => ({
            id: `solo-${day}`,
            date: nextDateForDay(day),
            timeLabel: formatTime(commute.departure_time),
            routeLabel: `${commute.origin.label} to ${commute.destination.label}`,
          }));
          setEntries(solo);
          return;
        }

        const matchEntries: ScheduleEntry[] = [];
        for (const match of acceptedMatches) {
          const isRequester = match.requester_id._id === user._id;
          const otherUser = isRequester
            ? match.addressee_id
            : match.requester_id;
          const otherCommuteId = isRequester
            ? match.addressee_commute_id
            : match.requester_commute_id;

          try {
            const otherCommute = await getCommuteById(otherCommuteId);
            const sharedDays = commute.days_of_week.filter((d) =>
              otherCommute.days_of_week.includes(d),
            );

            sharedDays.forEach((day) => {
              matchEntries.push({
                id: `${match._id}-${day}`,
                date: nextDateForDay(day),
                timeLabel: formatTime(commute.departure_time),
                routeLabel: `${commute.origin.label} to ${commute.destination.label}`,
                withName: otherUser.display_name || otherUser.full_name,
                avatarUrl: otherUser.avatar_url,
              });
            });
          } catch (error) {
            console.error(error);
          }
        }
        setEntries(matchEntries);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user]);

  const groups = useMemo(() => groupSchedule(entries), [entries]);
  const weekCount = entries.length;
  const progressPct = Math.min(100, Math.round((weekCount / 7) * 100));

  if (isLoading) {
    return (
      <div className="p-4 text-center text-on-surface-variant">Loading...</div>
    );
  }

  if (!myCommute) {
    return (
      <div className="p-4 text-center text-on-surface-variant">
        Set up your commute first to see your schedule.
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto md:max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-on-surface">Schedules</h1>
        <p className="text-on-surface-variant mt-1">
          Your upcoming shared journeys and carpools.
        </p>
      </div>

      <div className="bg-white border border-outline-variant rounded-2xl p-5">
        <p className="text-sm font-bold text-primary tracking-wide">STATUS</p>
        <h2 className="text-xl font-bold text-on-surface mt-1">
          Weekly Progress
        </h2>
        <p className="text-on-surface-variant text-sm mt-1">
          You have {weekCount} commute{weekCount === 1 ? '' : 's'} scheduled
          this week.
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 rounded-full bg-surface-container-low overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-primary">
            {progressPct}%
          </span>
        </div>
      </div>

      {groups.length === 0 && (
        <p className="text-center text-on-surface-variant">
          No upcoming commutes this week.
        </p>
      )}

      {groups.map((group) => (
        <div key={group.label}>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-sm font-semibold text-on-surface-variant">
              {group.label}
            </p>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="space-y-3">
            {group.items.map((entry) => (
              <div
                key={entry.id}
                className="bg-white border border-outline-variant rounded-2xl p-4 flex items-center gap-3"
              >
                {entry.avatarUrl && (
                  <img
                    src={entry.avatarUrl}
                    alt={entry.withName}
                    className="w-12 h-12 rounded-full object-cover shrink-0"
                  />
                )}

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <FaRegCalendarAlt size={12} />
                    <span>
                      {group.label === 'Later this week'
                        ? entry.date.toLocaleDateString(undefined, {
                            weekday: 'long',
                          })
                        : group.label}
                      , {entry.timeLabel}
                    </span>
                  </div>

                  <p className="font-bold text-on-surface mt-0.5 truncate">
                    {entry.routeLabel}
                  </p>

                  {entry.withName && (
                    <p className="text-sm text-on-surface-variant">
                      With {entry.withName}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Schedules;
