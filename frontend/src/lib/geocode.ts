export type PlaceSuggestion = {
  label: string;
  coordinates: [number, number];
};

// Free, no-API-key search via OpenStreetMap's Nominatim, used to power the address
// autocomplete dropdown. Returning several ranked, disambiguated results (each showing
// its full city/region/country) lets the user pick the right place themselves instead
// of the app silently guessing — that guess is what put a Surrey address in London.
export async function searchPlaces(query: string): Promise<PlaceSuggestion[]> {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&addressdetails=0&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) return [];

  const results = (await res.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  return results.map((r) => ({
    label: r.display_name,
    coordinates: [Number(r.lon), Number(r.lat)],
  }));
}
