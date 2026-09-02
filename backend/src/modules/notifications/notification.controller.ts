import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { noContent, ok } from '../../common/utils/apiResponse';
import * as notificationService from './notification.service';
import { parsePageParams } from '../../common/utils/pagination';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const params = parsePageParams(req.query as Record<string, unknown>);
  const result = await notificationService.listNotifications(req.user!.id, params);
  ok(res, result);
});

export const markRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markRead(req.params.id, req.user!.id);
  ok(res, notification);
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.markAllRead(req.user!.id);
  noContent(res);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.remove(req.params.id, req.user!.id);
  noContent(res);
});
