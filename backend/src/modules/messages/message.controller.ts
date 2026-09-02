import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, noContent, ok } from '../../common/utils/apiResponse';
import * as messageService from './message.service';
import { ListMessagesQuery } from './message.validation';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const { before, limit } = req.query as unknown as ListMessagesQuery;
  const messages = await messageService.listMessages(req.params.id, req.user!.id, before, limit);
  ok(res, messages);
});

export const send = asyncHandler(async (req: Request, res: Response) => {
  const message = await messageService.createMessage(req.params.id, req.user!.id, req.body);
  created(res, message);
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  await messageService.markRead(req.params.id, req.user!.id, req.body.upToMessageId);
  noContent(res);
});
