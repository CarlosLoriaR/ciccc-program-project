import bcrypt from 'bcrypt';
import { UserModel, IUser } from '../users/user.model';
import { findUserByEmailWithPassword } from '../users/user.service';
import { SessionModel } from './session.model';
import { ConflictError, UnauthorizedError, ForbiddenError } from '../../common/errors/httpErrors';
import { generateRefreshToken, hashToken, signAccessToken } from '../../common/utils/jwt';
import { env } from '../../config/env';
import { RegisterInput, LoginInput } from './auth.validation';

export interface RequestMeta {
  userAgent?: string;
  ipAddress?: string;
}

export interface AuthResult {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

async function issueSession(user: IUser, meta: RequestMeta): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken();
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  await SessionModel.create({
    user_id: user._id,
    refresh_token_hash: hashToken(refreshToken),
    user_agent: meta.userAgent,
    ip_address: meta.ipAddress,
    expires_at: expiresAt,
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput, meta: RequestMeta): Promise<AuthResult> {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) throw new ConflictError('An account with this email already exists');

  const user = await UserModel.create({
    email: input.email,
    password_hash: input.password, // hashed by the pre-save hook
    full_name: input.full_name,
    preferred_modes: input.preferred_modes ?? [],
  });

  const { accessToken, refreshToken } = await issueSession(user, meta);
  return { user, accessToken, refreshToken };
}

export async function login(input: LoginInput, meta: RequestMeta): Promise<AuthResult> {
  const user = await findUserByEmailWithPassword(input.email);
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const validPassword = await bcrypt.compare(input.password, user.password_hash);
  if (!validPassword) throw new UnauthorizedError('Invalid email or password');
  if (user.status !== 'active') throw new ForbiddenError('Account is not active');

  const { accessToken, refreshToken } = await issueSession(user, meta);
  return { user, accessToken, refreshToken };
}

export async function refreshSession(
  rawRefreshToken: string,
  meta: RequestMeta,
): Promise<{ accessToken: string; refreshToken: string }> {
  const tokenHash = hashToken(rawRefreshToken);
  const session = await SessionModel.findOne({ refresh_token_hash: tokenHash });
  if (!session || session.expires_at.getTime() < Date.now()) {
    throw new UnauthorizedError('Invalid or expired session');
  }

  const user = await UserModel.findById(session.user_id);
  if (!user || user.status !== 'active') throw new UnauthorizedError('Invalid session');

  await SessionModel.deleteOne({ _id: session._id });
  return issueSession(user, meta);
}

export async function logout(rawRefreshToken: string): Promise<void> {
  await SessionModel.deleteOne({ refresh_token_hash: hashToken(rawRefreshToken) });
}

export async function logoutAll(userId: string): Promise<void> {
  await SessionModel.deleteMany({ user_id: userId });
}
