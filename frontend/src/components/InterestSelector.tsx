import { INTEREST_OPTIONS } from '../constants/interests';

const MAX_INTERESTS = 5;

type InterestSelectorProps = {
  selected: string[];
  onChange: (interests: string[]) => void;
};

const InterestSelector = ({ selected, onChange }: InterestSelectorProps) => {
  const limitReached = selected.length >= MAX_INTERESTS;

  const toggleInterest = (interest: string) => {
    const isSelected = selected.includes(interest);

    if (isSelected) {
      onChange(selected.filter((i) => i !== interest));
      return;
    }
    if (limitReached) return;
    onChange([...selected, interest]);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {INTEREST_OPTIONS.map((interest) => {
          const isSelected = selected.includes(interest);
          const isDisable = !isSelected && limitReached;
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              disabled={isDisable}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary hover:scale-105 hover:shadow-md'
                  : isDisable
                    ? 'bg-surface-container-low text-outline-variant border-outline-variant opacity-50 cursor-not-allowed'
                    : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:scale-105 hover:shadow-md hover:border-primary'
              }`}
            >
              {interest}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InterestSelector;
