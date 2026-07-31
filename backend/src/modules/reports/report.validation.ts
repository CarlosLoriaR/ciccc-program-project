import { z } from 'zod';
import { REPORT_STATUSES } from '../../config/constants';

export const createReportSchema = z.object({
  reported_user_id: z.string().min(1),
  related_ride_id: z.string().optional(),
  reason: z.string().trim().min(1),
  description: z.string().max(2000).optional(),
});

export const resolveReportSchema = z.object({
  status: z.enum(REPORT_STATUSES),
});

export const listReportsQuerySchema = z.object({
  status: z.enum(REPORT_STATUSES).optional(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type ResolveReportInput = z.infer<typeof resolveReportSchema>;
export type ListReportsQuery = z.infer<typeof listReportsQuerySchema>;
