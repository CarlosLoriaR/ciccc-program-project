export interface GeoPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  label?: string;
}

export function toGeoPoint(longitude: number, latitude: number, label?: string): GeoPoint {
  return { type: 'Point', coordinates: [longitude, latitude], label };
}

/** Builds a $geoWithin/$centerSphere-compatible query for "within radiusKm of point". */
export function nearQuery(field: string, point: [number, number], radiusKm: number) {
  const radiusInRadians = radiusKm / 6371; // Earth radius in km
  return {
    [field]: {
      $geoWithin: {
        $centerSphere: [point, radiusInRadians],
      },
    },
  };
}
