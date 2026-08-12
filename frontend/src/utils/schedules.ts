const DAY_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const nextDateForDay = (
  dayCode: string,
  from: Date = new Date(),
): Date => {
  const targetIndex = DAY_ORDER.indexOf(dayCode.toLowerCase());
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);
  const diff = (targetIndex - date.getDay() + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date;
};

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export type ScheduleEntry = {
  id: string;
  date: Date;
  timeLabel: string;
  routeLabel: string;
  withName?: string;
  avatarUrl?: string;
};

export const groupSchedule = (entries: ScheduleEntry[]) => {
  const sorted = [...entries].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const groups: { label: string; items: ScheduleEntry[] }[] = [];
  const todays = sorted.filter((e) => sameDay(e.date, today));
  const tomorrows = sorted.filter((e) => sameDay(e.date, tomorrow));
  const later = sorted.filter((e) => e.date > tomorrow);

  if (todays.length) groups.push({ label: 'Today', items: todays });
  if (tomorrows.length) groups.push({ label: 'Tomorrow', items: tomorrows });
  if (later.length) groups.push({ label: 'Later this week', items: later });

  return groups;
};
