import { NotFoundError } from '../../common/errors/httpErrors';
import { IUser, UserModel } from './user.model';
import { UpdateLocationInput, UpdateProfileInput } from './user.validation';

export async function findUserById(id: string): Promise<IUser> {
  const user = await UserModel.findById(id);
  if (!user || user.status === 'deleted') throw new NotFoundError('User not found');
  return user;
}

export async function findUserByEmailWithPassword(email: string): Promise<IUser | null> {
  return UserModel.findOne({ email: email.toLowerCase() }).select('+password_hash');
}

export async function updateProfile(userId: string, patch: UpdateProfileInput): Promise<IUser> {
  const user = await findUserById(userId);
  Object.assign(user, patch);
  await user.save();
  return user;
}

export async function updateLocation(userId: string, patch: UpdateLocationInput): Promise<IUser> {
  const user = await findUserById(userId);
  if (patch.home_location) user.home_location = patch.home_location;
  if (patch.work_location) user.work_location = patch.work_location;
  await user.save();
  return user;
}

export async function softDeleteUser(userId: string): Promise<void> {
  const user = await findUserById(userId);
  user.status = 'deleted';
  await user.save();
}

export async function applyRatingUpdate(userId: string, newRating: number): Promise<void> {
  const user = await findUserById(userId);
  const totalScore = user.rating_avg * user.rating_count + newRating;
  user.rating_count += 1;
  user.rating_avg = Number((totalScore / user.rating_count).toFixed(2));
  await user.save();
}
