import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, ok } from '../../common/utils/apiResponse';
import * as reviewService from './review.service';
import { parsePageParams } from '../../common/utils/pagination';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.createReview(req.user!.id, req.body);
  created(res, review);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewService.getReviewById(req.params.id);
  ok(res, review);
});

/** Mounted at GET /users/:id/reviews — kept here since it's review data, not user data. */
export const getReviewsForUser = asyncHandler(async (req: Request, res: Response) => {
  const params = parsePageParams(req.query as Record<string, unknown>);
  const result = await reviewService.listReviewsForUser(req.params.id, params);
  ok(res, result);
});
