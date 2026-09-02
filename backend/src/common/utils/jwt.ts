import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { UserRole } from '../../config/constants';

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const options: jwt.SignOptions = { expiresIn: env.JWT_ACCESS_TTL as jwt.SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

/** Refresh tokens are opaque random strings, not JWTs — only their hash is ever persisted. */
export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString('hex');
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}
