import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../common/utils/jwt';
import { env } from '../config/env';
import { logger } from '../common/utils/logger';
import { domainEvents } from '../common/events/eventBus';
import { addSocket, removeSocket } from './presence';
import { conversationRoom, registerChatHandlers } from './chat.gateway';
import { ConversationModel } from '../modules/conversations/conversation.model';

function userRoom(userId: string): string {
  return `user:${userId}`;
}

async function joinOwnConversations(socket: Socket, userId: string): Promise<string[]> {
  const conversations = await ConversationModel.find({ participant_ids: userId }).select('_id').lean();
  const rooms = conversations.map((c) => conversationRoom(c._id.toString()));
  await Promise.all(rooms.map((room) => socket.join(room)));
  return rooms;
}

export function initSockets(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: { origin: env.CLIENT_ORIGIN, credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Missing auth token'));

    try {
      const payload = verifyAccessToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string;
    logger.info({ userId, socketId: socket.id }, 'Socket connected');

    void (async () => {
      await socket.join(userRoom(userId));
      const justCameOnline = addSocket(userId, socket.id);
      const conversationRooms = await joinOwnConversations(socket, userId);

      if (justCameOnline) {
        conversationRooms.forEach((room) => {
          socket.to(room).emit('presence:update', { userId, status: 'online' });
        });
      }
    })();

    registerChatHandlers(socket);

    socket.on('disconnect', () => {
      const wentOffline = removeSocket(userId, socket.id);
      if (wentOffline) {
        void ConversationModel.find({ participant_ids: userId })
          .select('_id')
          .lean()
          .then((conversations) => {
            conversations.forEach((c) => {
              socket.to(conversationRoom(c._id.toString())).emit('presence:update', {
                userId,
                status: 'offline',
                lastSeenAt: new Date(),
              });
            });
          });
      }
    });
  });

  domainEvents.on('notification:created', (notification) => {
    io.to(userRoom(notification.user_id.toString())).emit('notification:new', { notification });
  });

  domainEvents.on('message:created', ({ message, conversationId, participantIds }) => {
    io.to(conversationRoom(conversationId)).emit('message:new', { message });
    participantIds.forEach((participantId) => {
      io.to(userRoom(participantId)).emit('conversation:updated', { conversationId, lastMessage: message });
    });
  });

  domainEvents.on('message:read', ({ conversationId, userId: readerId, upToMessageId }) => {
    io.to(conversationRoom(conversationId)).emit('message:read:ack', {
      conversationId,
      userId: readerId,
      upToMessageId,
    });
  });

  return io;
}
