import { z } from 'zod';
import { COMMUTE_MODES } from '../../config/constants';

export const geoPointSchema = z.object({
  type: z.literal('Point').default('Point'),
  coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
  label: z.string().optional(),
});

export const updateProfileSchema = z.object({
  full_name: z.string().trim().min(1).optional(),
  display_name: z.string().trim().min(1).optional(),
  // Plain string, not .url() — holds a data: URI, not a standard http(s) URL.
  avatar_url: z.string().optional(),
  phone: z.string().trim().optional(),
  bio: z.string().trim().max(300).optional(),
  interests: z.array(z.string().trim().min(1)).max(10).optional(),
  photos: z.array(z.string()).max(5).optional(),
  preferred_modes: z.array(z.enum(COMMUTE_MODES)).optional(),
  schedule: z.record(z.unknown()).optional(),
});

export const updateLocationSchema = z
  .object({
    home_location: geoPointSchema.optional(),
    work_location: geoPointSchema.optional(),
  })
  .refine((data) => data.home_location || data.work_location, {
    message: 'Provide at least one of home_location or work_location',
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
