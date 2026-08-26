import { IMatch, MatchModel } from './match.model';
import { CommuteModel } from '../commutes/commute.model';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from '../../common/errors/httpErrors';
import { CreateMatchInput, ListMatchesQuery, RespondMatchInput } from './match.validation';
import { createConversationForMatch } from '../conversations/conversation.service';
import { ConversationModel } from '../conversations/conversation.model';
import { MessageModel } from '../messages/message.model';
import { notify } from '../notifications/notification.service';

async function acceptMatch(match: IMatch): Promise<IMatch> {
  match.status = 'accepted';
  match.matched_at = new Date();
  await match.save();
  await createConversationForMatch(match);
  await notify(match.requester_id.toString(), 'match_accepted', 'Match accepted', 'Your connection request was accepted', {
    matchId: match._id.toString(),
  });
  return match;
}

export async function createMatch(requesterId: string, input: CreateMatchInput): Promise<IMatch> {
  if (input.addressee_id === requesterId) {
    throw new BadRequestError('You cannot connect with yourself');
  }

  const [requesterCommute, addresseeCommute] = await Promise.all([
    CommuteModel.findById(input.requester_commute_id),
    CommuteModel.findById(input.addressee_commute_id),
  ]);

  if (!requesterCommute || requesterCommute.user_id.toString() !== requesterId) {
    throw new BadRequestError('requester_commute_id must belong to you');
  }
  if (!addresseeCommute || addresseeCommute.user_id.toString() !== input.addressee_id) {
    throw new BadRequestError('addressee_commute_id must belong to the addressee');
  }

  // If they already sent US a pending request, accept theirs instead of filing a
  // second, opposite-direction match.
  const reversePending = await MatchModel.findOne({
    requester_id: input.addressee_id,
    addressee_id: requesterId,
    status: 'pending',
  });
  if (reversePending) {
    return acceptMatch(reversePending);
  }

  const existing = await MatchModel.findOne({
    requester_id: requesterId,
    addressee_id: input.addressee_id,
    requester_commute_id: input.requester_commute_id,
    addressee_commute_id: input.addressee_commute_id,
  });
  if (existing) {
    if (existing.status === 'pending' || existing.status === 'accepted') {
      throw new ConflictError('A connection request already exists for these commutes');
    }
    // A cancelled/declined match already occupies this unique (requester, addressee,
    // commute pair) slot — revive it instead of inserting a new one.
    existing.status = 'pending';
    existing.matched_at = undefined;
    await existing.save();

    await notify(input.addressee_id, 'match_request', 'New connection request', 'Someone wants to connect on your commute', {
      matchId: existing._id.toString(),
    });

    return existing;
  }

  const match = await MatchModel.create({
    requester_id: requesterId,
    addressee_id: input.addressee_id,
    requester_commute_id: input.requester_commute_id,
    addressee_commute_id: input.addressee_commute_id,
    status: 'pending',
  });

  await notify(input.addressee_id, 'match_request', 'New connection request', 'Someone wants to connect on your commute', {
    matchId: match._id.toString(),
  });

  return match;
}

export async function listMatches(userId: string, filters: ListMatchesQuery): Promise<IMatch[]> {
  const query: Record<string, unknown> = {};

  if (filters.direction === 'incoming') query.addressee_id = userId;
  else if (filters.direction === 'outgoing') query.requester_id = userId;
  else query.$or = [{ requester_id: userId }, { addressee_id: userId }];

  if (filters.status) query.status = filters.status;

  return MatchModel.find(query)
    .populate('requester_id', 'full_name display_name avatar_url')
    .populate('addressee_id', 'full_name display_name avatar_url')
    .sort({ created_at: -1 });
}

async function findParticipantMatch(matchId: string, userId: string): Promise<IMatch> {
  const match = await MatchModel.findById(matchId);
  if (!match) throw new NotFoundError('Match not found');
  if (match.requester_id.toString() !== userId && match.addressee_id.toString() !== userId) {
    throw new ForbiddenError('You are not part of this match');
  }
  return match;
}

export async function getMatchById(matchId: string, userId: string): Promise<IMatch> {
  return findParticipantMatch(matchId, userId);
}

export async function respondToMatch(matchId: string, userId: string, input: RespondMatchInput): Promise<IMatch> {
  const match = await findParticipantMatch(matchId, userId);
  if (match.addressee_id.toString() !== userId) throw new ForbiddenError('Only the addressee can respond');
  if (match.status !== 'pending') throw new ConflictError('This match has already been resolved');

  if (input.action === 'accept') {
    return acceptMatch(match);
  }

  match.status = 'declined';
  await match.save();
  return match;
}

// Covers both withdrawing your own pending request and unmatching an accepted one.
export async function cancelMatch(matchId: string, userId: string): Promise<void> {
  const match = await findParticipantMatch(matchId, userId);
  if (match.status !== 'pending' && match.status !== 'accepted') {
    throw new ConflictError('This match has already been resolved');
  }

  const wasAccepted = match.status === 'accepted';
  match.status = 'cancelled';
  await match.save();

  if (wasAccepted) {
    // Unmatching removes the conversation entirely, not just marks it inactive — an
    // undone match shouldn't leave a chat thread that still looks usable.
    const conversation = await ConversationModel.findOne({ match_id: match._id });
    if (conversation) {
      await MessageModel.deleteMany({ conversation_id: conversation._id });
      await conversation.deleteOne();
    }
  }
}
