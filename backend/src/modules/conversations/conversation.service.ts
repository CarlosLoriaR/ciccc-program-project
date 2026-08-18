import { ConversationModel, IConversation } from './conversation.model';
import { IMatch, MatchModel } from '../matches/match.model';
import { CommuteModel } from '../commutes/commute.model';
import { UserModel } from '../users/user.model';
import { MessageModel } from '../messages/message.model';
import { ForbiddenError, NotFoundError } from '../../common/errors/httpErrors';
import { toPublicUser } from '../users/user.mapper';

export async function createConversationForMatch(match: IMatch): Promise<IConversation> {
  return ConversationModel.create({
    match_id: match._id,
    participant_ids: [match.requester_id, match.addressee_id],
  });
}

// participant_ids is typed as ObjectId[], but after .populate() each entry is actually a
// full user document at runtime (TS doesn't track that shape change) — a populated
// document's .toString() returns "[object Object]", not its id, so comparing it directly
// against a plain id string always fails. Read ._id off populated entries when present.
function participantId(entry: IConversation['participant_ids'][number]): string {
  const populated = entry as unknown as { _id?: { toString(): string } };
  return (populated._id ?? entry).toString();
}

function assertParticipant(conversation: IConversation, userId: string): void {
  if (!conversation.participant_ids.some((entry) => participantId(entry) === userId)) {
    throw new ForbiddenError('You are not part of this conversation');
  }
}

export async function listMyConversations(userId: string) {
  const conversations = await ConversationModel.find({ participant_ids: userId })
    .populate('participant_ids', 'full_name display_name avatar_url')
    .sort({ last_message_at: -1, created_at: -1 });

  return Promise.all(
    conversations.map(async (conversation) => {
      const lastMessage = await MessageModel.findOne({ conversation_id: conversation._id })
        .sort({ created_at: -1 })
        .select('body sender_id created_at');
      return { conversation, lastMessage };
    }),
  );
}

export async function getConversationById(conversationId: string, userId: string) {
  const conversation = await ConversationModel.findById(conversationId).populate(
    'participant_ids',
    'full_name display_name avatar_url rating_avg rating_count',
  );
  if (!conversation) throw new NotFoundError('Conversation not found');
  assertParticipant(conversation, userId);

  const match = await MatchModel.findById(conversation.match_id);
  if (!match) throw new NotFoundError('Underlying match not found');

  const counterpartUserId = match.requester_id.toString() === userId ? match.addressee_id : match.requester_id;
  const counterpartCommuteId =
    match.requester_id.toString() === userId ? match.addressee_commute_id : match.requester_commute_id;

  const [counterpartUser, counterpartCommute] = await Promise.all([
    UserModel.findById(counterpartUserId),
    CommuteModel.findById(counterpartCommuteId),
  ]);

  return {
    conversation,
    counterpart: {
      user: counterpartUser ? toPublicUser(counterpartUser) : null,
      commute: counterpartCommute,
    },
  };
}

export async function assertConversationParticipant(conversationId: string, userId: string): Promise<IConversation> {
  const conversation = await ConversationModel.findById(conversationId);
  if (!conversation) throw new NotFoundError('Conversation not found');
  assertParticipant(conversation, userId);
  return conversation;
}

export async function touchLastMessageAt(conversationId: string, date: Date): Promise<void> {
  await ConversationModel.updateOne({ _id: conversationId }, { $set: { last_message_at: date } });
}
