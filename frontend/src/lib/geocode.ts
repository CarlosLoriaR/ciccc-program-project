export type PlaceSuggestion = {
  label: string;
  coordinates: [number, number];
};

// OpenStreetMap Nominatim search, no API key needed — powers the address autocomplete dropdown.
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
