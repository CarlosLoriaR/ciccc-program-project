import { Types } from 'mongoose';
import { CommuteModel, ICommute } from './commute.model';
import { MatchModel } from '../matches/match.model';
import { ForbiddenError, NotFoundError } from '../../common/errors/httpErrors';
import { nearQuery } from '../../common/utils/geo';
import { PageParams, toPagedResult } from '../../common/utils/pagination';
import { CreateCommuteInput, UpdateCommuteInput } from './commute.validation';

export async function createCommute(userId: string, input: CreateCommuteInput): Promise<ICommute> {
  return CommuteModel.create({ ...input, user_id: userId });
}

export async function listMyCommutes(userId: string): Promise<ICommute[]> {
  return CommuteModel.find({ user_id: userId }).sort({ created_at: -1 });
}

async function canView(commute: ICommute, requesterId: string): Promise<boolean> {
  if (commute.user_id.toString() === requesterId) return true;

  const hasAcceptedMatch = await MatchModel.exists({
    status: 'accepted',
    $or: [
      { requester_commute_id: commute._id, addressee_id: requesterId },
      { addressee_commute_id: commute._id, requester_id: requesterId },
    ],
  });
  return Boolean(hasAcceptedMatch);
}

export async function getCommuteById(commuteId: string, requesterId: string): Promise<ICommute> {
  const commute = await CommuteModel.findById(commuteId);
  if (!commute) throw new NotFoundError('Commute not found');
  if (!(await canView(commute, requesterId))) throw new ForbiddenError('You cannot view this commute');
  return commute;
}

export async function updateCommute(
  commuteId: string,
  userId: string,
  patch: UpdateCommuteInput,
): Promise<ICommute> {
  const commute = await CommuteModel.findById(commuteId);
  if (!commute) throw new NotFoundError('Commute not found');
  if (commute.user_id.toString() !== userId) throw new ForbiddenError('You do not own this commute');

  Object.assign(commute, patch);
  await commute.save();
  return commute;
}

export async function deactivateCommute(commuteId: string, userId: string): Promise<void> {
  const commute = await CommuteModel.findById(commuteId);
  if (!commute) throw new NotFoundError('Commute not found');
  if (commute.user_id.toString() !== userId) throw new ForbiddenError('You do not own this commute');

  commute.is_active = false;
  await commute.save();
}

export interface DiscoverParams extends PageParams {
  commuteId: string;
  radiusKm: number;
}

export async function discoverCommutes(requesterId: string, params: DiscoverParams) {
  const base = await CommuteModel.findById(params.commuteId);
  if (!base) throw new NotFoundError('Reference commute not found');
  if (base.user_id.toString() !== requesterId) throw new ForbiddenError('Not your commute');

  const relatedMatches = await MatchModel.find({
    $or: [{ requester_id: requesterId }, { addressee_id: requesterId }],
  }).select('requester_id addressee_id status');

  const excludedUserIds = new Set<string>([requesterId]);
  // Keep incoming pending requests visible — "Connect" on them gets auto-accepted
  // (see the reverse-pending check in match.service.createMatch).
  for (const m of relatedMatches) {
    // Cancelled/declined shouldn't permanently block rediscovering each other.
    if (m.status === 'cancelled' || m.status === 'declined') continue;

    const iAmRequester = m.requester_id.toString() === requesterId;
    const otherUserId = iAmRequester ? m.addressee_id.toString() : m.requester_id.toString();

    if (m.status === 'pending' && !iAmRequester) continue;

    excludedUserIds.add(otherUserId);
  }

  const filter = {
    is_active: true,
    user_id: { $nin: [...excludedUserIds].map((id) => new Types.ObjectId(id)) },
    modes: { $in: base.modes },
    ...nearQuery('origin', base.origin.coordinates, params.radiusKm),
    ...nearQuery('destination', base.destination.coordinates, params.radiusKm),
  };

  const [rawItems, total] = await Promise.all([
    CommuteModel.find(filter)
      .populate('user_id', 'full_name display_name avatar_url bio interests photos rating_avg rating_count total_rides')
      .skip(params.skip)
      .limit(params.limit)
      .sort({ created_at: -1 }),
    CommuteModel.countDocuments(filter),
  ]);

  // Drop commutes whose owning user no longer exists (e.g. deleted directly in the DB).
  const items = rawItems.filter((item) => item.user_id != null);

  return toPagedResult(items, total, params);
}
