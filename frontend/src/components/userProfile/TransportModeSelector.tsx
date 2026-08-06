const MODES = ['Car', 'Train', 'Bus', 'Ferry'];

type TransportModeSelectorProps = {
  selected: string[];
  onChange: (modes: string[]) => void;
};

const TransportModeSelector = ({ selected, onChange }: TransportModeSelectorProps) => {
  const toggleMode = (mode: string) => {
    if (selected.includes(mode)) {
      onChange(selected.filter((m) => m !== mode));
    } else {
      onChange([...selected, mode]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map((mode) => {
        const isSelected = selected.includes(mode);
        return (
          <button
            key={mode}
            type="button"
            onClick={() => toggleMode(mode)}
            className={`px-5 h-12 rounded-full text-sm font-semibold border transition-all ${
              isSelected
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary'
            }`}
          >
            {mode}
          </button>
        );
      })}
    </div>
  );
};

export default TransportModeSelector;
