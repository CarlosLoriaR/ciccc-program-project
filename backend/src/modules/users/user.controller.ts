import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { noContent, ok } from '../../common/utils/apiResponse';
import * as userService from './user.service';
import { toPrivateUser, toPublicUser } from './user.mapper';

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.findUserById(req.user!.id);
  ok(res, toPrivateUser(user));
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateProfile(req.user!.id, req.body);
  ok(res, toPrivateUser(user));
});

export const updateMyLocation = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateLocation(req.user!.id, req.body);
  ok(res, toPrivateUser(user));
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  await userService.softDeleteUser(req.user!.id);
  noContent(res);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.findUserById(req.params.id);
  ok(res, toPublicUser(user));
});
