import type { GeoJSONPoint } from './user';

export type Commute = {
  _id: string;
  user_id: string;
  title: string;
  mode: string;
  origin: GeoJSONPoint & { label?: string };
  destination: GeoJSONPoint & { label?: string };
  waypoints: GeoJSONPoint[];
  transit_lines: string[];
  departure_time: string;
  return_time: string;
  days_of_week: string[];
  direction: string;
  seats_available: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
