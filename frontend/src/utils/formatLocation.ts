// Nominatim returns long, comma-separated addresses (e.g. "Surrey, Metro Vancouver
// Regional District, British Columbia, Canada"). This is display-only shortening —
// the full label is still what gets geocoded/stored/searched; we just show less of it.
// Nominatim sometimes inserts a verbose administrative-unit segment (e.g. "Metro
// Vancouver Regional District") between the city and the province — drop those too,
// they're rarely what makes a location recognizable.
const VERBOSE_ADMIN_UNIT = /regional district|metropolitan|census division|district municipality/i;

export function shortenLocationLabel(label: string | undefined, segmentsToKeep = 2): string {
  if (!label) return '';

  const segments = label
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/\d/.test(s) && !VERBOSE_ADMIN_UNIT.test(s));

  // The country is virtually always the last segment in a Nominatim result and rarely
  // adds anything useful for "who's nearby", so drop it before truncating.
  const withoutCountry = segments.length > 1 ? segments.slice(0, -1) : segments;

  return withoutCountry.slice(0, segmentsToKeep).join(', ') || label;
}
