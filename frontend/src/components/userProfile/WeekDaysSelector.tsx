const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type WeekDaysSelectorProps = {
  selected: string[];
  onChange: (days: string[]) => void;
};

const WeekDaysSelector = ({ selected, onChange }: WeekDaysSelectorProps) => {
  const toggleDay = (day: string) => {
    if (selected.includes(day)) {
      onChange(selected.filter((d) => d !== day));
    } else {
      onChange([...selected, day]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {DAYS.map((day) => {
        const isSelected = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            onClick={() => toggleDay(day)}
            className={`w-12 h-12 rounded-full text-sm font-semibold border transition-all ${
              isSelected
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary'
            }`}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
};

export default WeekDaysSelector;
