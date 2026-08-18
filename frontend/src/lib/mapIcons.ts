import L from 'leaflet';

// A circular badge with a person silhouette — reads more clearly as "a person" on the
// map than a generic teardrop map-pin shape does at this size.
function personIcon(color: string, size = 36): L.DivIcon {
  const glyphSize = Math.round(size * 0.55);
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};border:3px solid white;
      box-shadow:0 1px 3px rgba(0,0,0,0.4);
      display:flex;align-items:center;justify-content:center;
    ">
      <svg width="${glyphSize}" height="${glyphSize}" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8v1H4v-1z"/>
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function dotIcon(color: string, size = 22): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:3px solid white;box-shadow:0 0 0 3px ${color}55, 0 1px 3px rgba(0,0,0,0.4);"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export const selfIcon = dotIcon('#5d4eb7');
export const candidateIcon = personIcon('#006492');
