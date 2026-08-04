import { Schema, model, Document, Types } from 'mongoose';
import {
  COMMUTE_DIRECTIONS,
  COMMUTE_MODES,
  CommuteDirection,
  CommuteMode,
  DAYS_OF_WEEK,
  DayOfWeek,
} from '../../config/constants';
import { GeoPoint } from '../../common/utils/geo';

export interface Waypoint {
  coordinates: [number, number];
  label?: string;
}

export interface ICommute extends Document {
  _id: Types.ObjectId;
  user_id: Types.ObjectId;
  title?: string;
  modes: CommuteMode[];
  origin: GeoPoint;
  destination: GeoPoint;
  waypoints: Waypoint[];
  transit_lines: string[];
  departure_time?: string;
  return_time?: string;
  days_of_week: DayOfWeek[];
  direction?: CommuteDirection;
  seats_available?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const geoPointSchema = new Schema<GeoPoint>(
  {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true },
    label: String,
  },
  { _id: false },
);

const waypointSchema = new Schema<Waypoint>(
  { coordinates: { type: [Number], required: true }, label: String },
  { _id: false },
);

const commuteSchema = new Schema<ICommute>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: String,
    modes: { type: [String], enum: COMMUTE_MODES, required: true },
    origin: { type: geoPointSchema, required: true },
    destination: { type: geoPointSchema, required: true },
    waypoints: { type: [waypointSchema], default: [] },
    transit_lines: { type: [String], default: [] },
    departure_time: String,
    return_time: String,
    days_of_week: [{ type: String, enum: DAYS_OF_WEEK }],
    direction: { type: String, enum: COMMUTE_DIRECTIONS },
    seats_available: Number,
    is_active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

commuteSchema.index({ origin: '2dsphere' });
commuteSchema.index({ destination: '2dsphere' });

export const CommuteModel = model<ICommute>('Commute', commuteSchema);
