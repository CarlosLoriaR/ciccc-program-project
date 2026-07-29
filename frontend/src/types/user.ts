export type GeoJSONPoint = {
  type: 'Point';
  coordinates: [number, number];
};

export type User = {
  _id: string;
  email: string;
  full_name: string;
  display_name: string;
  avatar_url: string;
  home_location: GeoJSONPoint;
  work_location: GeoJSONPoint;
  preferred_modes: string[];
  rating_avg: number;
  rating_count: number;
  role: string;
  status: string;
  created_at: string;
  updated_at: string;
  bio?: string;
  interests?: string[];
  total_rides?: number;
  photos?: string[];
};
