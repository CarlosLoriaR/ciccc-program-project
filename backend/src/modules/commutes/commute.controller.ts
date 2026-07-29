import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, noContent, ok } from '../../common/utils/apiResponse';
import * as commuteService from './commute.service';
import { parsePageParams } from '../../common/utils/pagination';
import { DiscoverCommutesQuery } from './commute.validation';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const commute = await commuteService.createCommute(req.user!.id, req.body);
  created(res, commute);
});

export const listMine = asyncHandler(async (req: Request, res: Response) => {
  const commutes = await commuteService.listMyCommutes(req.user!.id);
  ok(res, commutes);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const commute = await commuteService.getCommuteById(req.params.id, req.user!.id);
  ok(res, commute);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const commute = await commuteService.updateCommute(req.params.id, req.user!.id, req.body);
  ok(res, commute);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await commuteService.deactivateCommute(req.params.id, req.user!.id);
  noContent(res);
});

export const discover = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as DiscoverCommutesQuery;
  const pageParams = parsePageParams(query, query.limit, 100);
  const result = await commuteService.discoverCommutes(req.user!.id, {
    ...pageParams,
    commuteId: query.commuteId,
    radiusKm: query.radiusKm,
  });
  ok(res, result);
});
