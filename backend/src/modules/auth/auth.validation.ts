import { z } from 'zod';
import { COMMUTE_MODES } from '../../config/constants';

export const registerSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
  full_name: z.string().trim().min(1),
  preferred_modes: z.array(z.enum(COMMUTE_MODES)).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
