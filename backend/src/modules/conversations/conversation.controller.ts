import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { ok } from '../../common/utils/apiResponse';
import * as conversationService from './conversation.service';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await conversationService.listMyConversations(req.user!.id);
  ok(res, conversations);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await conversationService.getConversationById(req.params.id, req.user!.id);
  ok(res, conversation);
});
