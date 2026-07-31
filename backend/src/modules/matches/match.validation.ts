import { z } from 'zod';
import { MATCH_STATUSES } from '../../config/constants';

export const createMatchSchema = z.object({
  addressee_id: z.string().min(1),
  requester_commute_id: z.string().min(1),
  addressee_commute_id: z.string().min(1),
});

export const respondMatchSchema = z.object({
  action: z.enum(['accept', 'decline']),
});

export const listMatchesQuerySchema = z.object({
  status: z.enum(MATCH_STATUSES).optional(),
  direction: z.enum(['incoming', 'outgoing']).optional(),
});

export type CreateMatchInput = z.infer<typeof createMatchSchema>;
export type RespondMatchInput = z.infer<typeof respondMatchSchema>;
export type ListMatchesQuery = z.infer<typeof listMatchesQuerySchema>;
