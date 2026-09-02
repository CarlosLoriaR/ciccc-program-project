import { Schema, model, Document, Types } from 'mongoose';
import { BOOKING_STATUSES, BookingStatus } from '../../config/constants';
import { GeoPoint } from '../../common/utils/geo';

export interface IRideBooking extends Document {
  _id: Types.ObjectId;
  ride_id: Types.ObjectId;
  passenger_id: Types.ObjectId;
  seats_booked: number;
  pickup_point?: GeoPoint;
  status: BookingStatus;
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

const rideBookingSchema = new Schema<IRideBooking>(
  {
    ride_id: { type: Schema.Types.ObjectId, ref: 'Ride', required: true, index: true },
    passenger_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    seats_booked: { type: Number, default: 1, min: 1 },
    pickup_point: geoPointSchema,
    status: { type: String, enum: BOOKING_STATUSES, default: 'requested' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

export const RideBookingModel = model<IRideBooking>('RideBooking', rideBookingSchema);
