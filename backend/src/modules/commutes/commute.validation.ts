import { z } from 'zod';
import { COMMUTE_DIRECTIONS, COMMUTE_MODES, DAYS_OF_WEEK } from '../../config/constants';
import { geoPointSchema } from '../users/user.validation';

const waypointSchema = z.object({
  coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
  label: z.string().optional(),
});

export const createCommuteSchema = z.object({
  title: z.string().trim().optional(),
  // Defaults to 'car' — the onboarding flow doesn't ask for a transport mode yet,
  // so this keeps commute creation working until that UI exists.
  mode: z.enum(COMMUTE_MODES).default('car'),
  origin: geoPointSchema,
  destination: geoPointSchema,
  waypoints: z.array(waypointSchema).optional(),
  transit_lines: z.array(z.string()).optional(),
  departure_time: z.string().optional(),
  return_time: z.string().optional(),
  days_of_week: z.array(z.enum(DAYS_OF_WEEK)).optional(),
  direction: z.enum(COMMUTE_DIRECTIONS).optional(),
  seats_available: z.number().int().min(0).optional(),
});

export const updateCommuteSchema = createCommuteSchema.partial().extend({
  is_active: z.boolean().optional(),
});

export const discoverCommutesQuerySchema = z.object({
  commuteId: z.string().min(1),
  radiusKm: z.coerce.number().min(0.1).max(200).default(10),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateCommuteInput = z.infer<typeof createCommuteSchema>;
export type UpdateCommuteInput = z.infer<typeof updateCommuteSchema>;
export type DiscoverCommutesQuery = z.infer<typeof discoverCommutesQuerySchema>;
