import { useEffect, useRef, useState } from 'react';
import { searchPlaces, type PlaceSuggestion } from '../lib/geocode';

type AddressAutocompleteProps = {
  label: string;
  placeholder: string;
  onSelect: (suggestion: PlaceSuggestion) => void;
};

const AddressAutocomplete = ({ label, placeholder, onSelect }: AddressAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending debounced search if the field unmounts mid-type.
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!value.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchPlaces(value);
        setSuggestions(results);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 400);
  };

  const handleSelect = (suggestion: PlaceSuggestion) => {
    setQuery(suggestion.label);
    setSuggestions([]);
    setIsOpen(false);
    onSelect(suggestion);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-on-surface mb-2">{label}</label>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-surface-container-low rounded-xl text-on-surface font-medium placeholder:text-outline placeholder:font-normal border border-transparent focus:border-primary focus:outline-none transition-colors"
      />
      {isLoading && <p className="text-xs text-on-surface-variant mt-1">Searching...</p>}
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white rounded-xl border border-outline-variant shadow-lg overflow-hidden max-h-56 overflow-y-auto">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-3 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressAutocomplete;
