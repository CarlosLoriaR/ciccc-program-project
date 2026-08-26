// Display-only shortening of Nominatim's long comma-separated addresses.
const VERBOSE_ADMIN_UNIT = /regional district|metropolitan|census division|district municipality/i;

export function shortenLocationLabel(label: string | undefined, segmentsToKeep = 2): string {
  if (!label) return '';

  const segments = label
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/\d/.test(s) && !VERBOSE_ADMIN_UNIT.test(s));

  // Drop the country (last segment) — rarely useful for "who's nearby".
  const withoutCountry = segments.length > 1 ? segments.slice(0, -1) : segments;

  return withoutCountry.slice(0, segmentsToKeep).join(', ') || label;
}
