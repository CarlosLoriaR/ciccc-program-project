import { Socket } from 'socket.io';
import { assertConversationParticipant } from '../modules/conversations/conversation.service';
import { createMessage, markRead } from '../modules/messages/message.service';
import { logger } from '../common/utils/logger';

export function conversationRoom(conversationId: string): string {
  return `conversation:${conversationId}`;
}

export function registerChatHandlers(socket: Socket): void {
  const userId = socket.data.userId as string;

  socket.on('conversation:join', async ({ conversationId }: { conversationId: string }) => {
    try {
      await assertConversationParticipant(conversationId, userId);
      await socket.join(conversationRoom(conversationId));
    } catch (err) {
      logger.warn({ err, userId, conversationId }, 'Rejected conversation:join');
    }
  });

  socket.on('conversation:leave', ({ conversationId }: { conversationId: string }) => {
    void socket.leave(conversationRoom(conversationId));
  });

  socket.on('typing:start', ({ conversationId }: { conversationId: string }) => {
    socket.to(conversationRoom(conversationId)).emit('typing:start', { conversationId, userId });
  });

  socket.on('typing:stop', ({ conversationId }: { conversationId: string }) => {
    socket.to(conversationRoom(conversationId)).emit('typing:stop', { conversationId, userId });
  });

  socket.on('message:send', async ({ conversationId, body, attachments }) => {
    try {
      await createMessage(conversationId, userId, { body, attachments });
    } catch (err) {
      socket.emit('error', { message: (err as Error).message, context: 'message:send' });
    }
  });

  socket.on('message:read', async ({ conversationId, upToMessageId }) => {
    try {
      await markRead(conversationId, userId, upToMessageId);
    } catch (err) {
      socket.emit('error', { message: (err as Error).message, context: 'message:read' });
    }
  });
}
