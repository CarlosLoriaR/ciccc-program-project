import { z } from 'zod';

const attachmentSchema = z.object({
  url: z.string().url(),
  type: z.string(),
  size: z.number().optional(),
});

export const sendMessageSchema = z.object({
  body: z.string().trim().min(1).max(4000),
  attachments: z.array(attachmentSchema).optional(),
});

export const markReadSchema = z.object({
  upToMessageId: z.string().min(1),
});

export const listMessagesQuerySchema = z.object({
  before: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type MarkReadInput = z.infer<typeof markReadSchema>;
export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;
