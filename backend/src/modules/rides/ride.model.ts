import { Schema, model, Document, Types } from 'mongoose';
import { RIDE_STATUSES, RideStatus } from '../../config/constants';
import { GeoPoint } from '../../common/utils/geo';

export interface Vehicle {
  make?: string;
  model?: string;
  color?: string;
  plate?: string;
}

export interface IRide extends Document {
  _id: Types.ObjectId;
  driver_id: Types.ObjectId;
  commute_id?: Types.ObjectId;
  origin: GeoPoint;
  destination: GeoPoint;
  departure_datetime: Date;
  seats_total: number;
  seats_taken: number;
  price_per_seat?: number;
  vehicle?: Vehicle;
  notes?: string;
  status: RideStatus;
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

const vehicleSchema = new Schema<Vehicle>(
  { make: String, model: String, color: String, plate: String },
  { _id: false },
);

const rideSchema = new Schema<IRide>(
  {
    driver_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    commute_id: { type: Schema.Types.ObjectId, ref: 'Commute' },
    origin: { type: geoPointSchema, required: true },
    destination: { type: geoPointSchema, required: true },
    departure_datetime: { type: Date, required: true },
    seats_total: { type: Number, required: true, min: 1 },
    seats_taken: { type: Number, default: 0, min: 0 },
    price_per_seat: Number,
    vehicle: vehicleSchema,
    notes: String,
    status: { type: String, enum: RIDE_STATUSES, default: 'scheduled' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

rideSchema.index({ origin: '2dsphere' });
rideSchema.index({ destination: '2dsphere' });
rideSchema.index({ departure_datetime: 1 });

export const RideModel = model<IRide>('Ride', rideSchema);
