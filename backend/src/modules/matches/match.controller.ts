import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, noContent, ok } from '../../common/utils/apiResponse';
import * as matchService from './match.service';
import { ListMatchesQuery } from './match.validation';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const match = await matchService.createMatch(req.user!.id, req.body);
  created(res, match);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const matches = await matchService.listMatches(req.user!.id, req.query as unknown as ListMatchesQuery);
  ok(res, matches);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const match = await matchService.getMatchById(req.params.id, req.user!.id);
  ok(res, match);
});

export const respond = asyncHandler(async (req: Request, res: Response) => {
  const match = await matchService.respondToMatch(req.params.id, req.user!.id, req.body);
  ok(res, match);
});

export const cancel = asyncHandler(async (req: Request, res: Response) => {
  await matchService.cancelMatch(req.params.id, req.user!.id);
  noContent(res);
});
