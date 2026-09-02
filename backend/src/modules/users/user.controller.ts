import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { noContent, ok } from '../../common/utils/apiResponse';
import { BadRequestError } from '../../common/errors/httpErrors';
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

// Returns a persistent data: URI for the uploaded image.
export const uploadPhoto = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw new BadRequestError('No file uploaded');
  const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  ok(res, { url: dataUri });
});
