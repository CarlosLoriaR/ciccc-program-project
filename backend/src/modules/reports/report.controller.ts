import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, ok } from '../../common/utils/apiResponse';
import * as reportService from './report.service';
import { ListReportsQuery } from './report.validation';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.createReport(req.user!.id, req.body);
  created(res, report);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const reports = await reportService.listReports(req.query as unknown as ListReportsQuery);
  ok(res, reports);
});

export const resolve = asyncHandler(async (req: Request, res: Response) => {
  const report = await reportService.resolveReport(req.params.id, req.user!.id, req.body);
  ok(res, report);
});
