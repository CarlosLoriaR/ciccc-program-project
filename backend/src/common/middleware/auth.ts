import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../errors/httpErrors';
import { UserModel } from '../../modules/users/user.model';
import { asyncHandler } from '../utils/asyncHandler';
import { UserRole } from '../../config/constants';

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing access token');
  }

  const token = header.slice('Bearer '.length);
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new UnauthorizedError('Invalid or expired access token');
  }

  const user = await UserModel.findById(payload.sub).select('_id role status').lean();
  if (!user) throw new UnauthorizedError('User no longer exists');
  if (user.status !== 'active') throw new ForbiddenError('Account is not active');

  req.user = { id: user._id.toString(), role: user.role, status: user.status };
  next();
});

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) throw new UnauthorizedError();
    if (!roles.includes(req.user.role)) throw new ForbiddenError('Insufficient permissions');
    next();
  };
}
