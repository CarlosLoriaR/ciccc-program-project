import { z } from 'zod';
import { geoPointSchema } from '../users/user.validation';

const vehicleSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  color: z.string().optional(),
  plate: z.string().optional(),
});

export const createRideSchema = z.object({
  commute_id: z.string().optional(),
  origin: geoPointSchema,
  destination: geoPointSchema,
  departure_datetime: z.coerce.date(),
  seats_total: z.number().int().min(1),
  price_per_seat: z.number().min(0).optional(),
  vehicle: vehicleSchema.optional(),
  notes: z.string().optional(),
});

export const updateRideSchema = createRideSchema.partial().extend({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
});

export const searchRidesQuerySchema = z.object({
  originLng: z.coerce.number(),
  originLat: z.coerce.number(),
  destinationLng: z.coerce.number(),
  destinationLat: z.coerce.number(),
  date: z.string().optional(),
  minSeats: z.coerce.number().int().min(1).default(1),
  radiusKm: z.coerce.number().min(0.1).max(200).default(10),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const createBookingSchema = z.object({
  seats_booked: z.number().int().min(1).default(1),
  pickup_point: geoPointSchema.optional(),
});

export const updateBookingSchema = z.object({
  action: z.enum(['confirm', 'decline', 'cancel']),
});

export type CreateRideInput = z.infer<typeof createRideSchema>;
export type UpdateRideInput = z.infer<typeof updateRideSchema>;
export type SearchRidesQuery = z.infer<typeof searchRidesQuerySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
