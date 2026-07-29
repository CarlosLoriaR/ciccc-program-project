import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, noContent, ok } from '../../common/utils/apiResponse';
import { toPrivateUser } from '../users/user.mapper';
import * as authService from './auth.service';
import { RequestMeta } from './auth.service';
import { env, isProduction } from '../../config/env';
import { UnauthorizedError } from '../../common/errors/httpErrors';

const REFRESH_COOKIE = 'refreshToken';

function cookieOptions() {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    domain: env.COOKIE_DOMAIN,
    maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  };
}

function requestMeta(req: Request): RequestMeta {
  return { userAgent: req.headers['user-agent'], ipAddress: req.ip };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.register(req.body, requestMeta(req));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  created(res, { user: toPrivateUser(user), accessToken });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await authService.login(req.body, requestMeta(req));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  ok(res, { user: toPrivateUser(user), accessToken });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  if (!rawToken) throw new UnauthorizedError('Missing refresh token');

  const { accessToken, refreshToken } = await authService.refreshSession(rawToken, requestMeta(req));
  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions());
  ok(res, { accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  if (rawToken) await authService.logout(rawToken);
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  noContent(res);
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutAll(req.user!.id);
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  noContent(res);
});
