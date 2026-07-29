import { Types } from 'mongoose';
import { IMessage, MessageModel } from './message.model';
import { assertConversationParticipant, touchLastMessageAt } from '../conversations/conversation.service';
import { domainEvents } from '../../common/events/eventBus';
import { notify } from '../notifications/notification.service';
import { SendMessageInput } from './message.validation';

export async function createMessage(
  conversationId: string,
  senderId: string,
  input: SendMessageInput,
): Promise<IMessage> {
  const conversation = await assertConversationParticipant(conversationId, senderId);

  const message = await MessageModel.create({
    conversation_id: conversationId,
    sender_id: senderId,
    body: input.body,
    attachments: input.attachments ?? [],
    read_by: [senderId],
  });

  await touchLastMessageAt(conversationId, message.created_at);

  const participantIds = conversation.participant_ids.map((id) => id.toString());
  domainEvents.emit('message:created', { message, conversationId, participantIds });

  const recipients = participantIds.filter((id) => id !== senderId);
  await Promise.all(
    recipients.map((recipientId) =>
      notify(recipientId, 'new_message', 'New message', input.body.slice(0, 140), { conversationId }),
    ),
  );

  return message;
}

export async function listMessages(conversationId: string, userId: string, before: string | undefined, limit: number) {
  await assertConversationParticipant(conversationId, userId);

  const filter: Record<string, unknown> = { conversation_id: conversationId };
  if (before) filter._id = { $lt: new Types.ObjectId(before) };

  const messages = await MessageModel.find(filter).sort({ _id: -1 }).limit(limit);
  return messages.reverse();
}

export async function markRead(conversationId: string, userId: string, upToMessageId: string): Promise<void> {
  await assertConversationParticipant(conversationId, userId);

  await MessageModel.updateMany(
    { conversation_id: conversationId, _id: { $lte: new Types.ObjectId(upToMessageId) } },
    { $addToSet: { read_by: userId } },
  );

  domainEvents.emit('message:read', { conversationId, userId, upToMessageId });
}
