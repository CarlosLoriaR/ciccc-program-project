import { EventEmitter } from 'events';
import { INotification } from '../../modules/notifications/notification.model';
import { IMessage } from '../../modules/messages/message.model';

/**
 * Decouples services from the Socket.IO layer: services publish domain events here,
 * the socket layer subscribes and pushes to the right rooms. REST-only requests still
 * fire these events, so realtime clients stay in sync regardless of which transport
 * triggered the change.
 */
interface DomainEvents {
  'notification:created': (notification: INotification) => void;
  'message:created': (payload: { message: IMessage; conversationId: string; participantIds: string[] }) => void;
  'message:read': (payload: { conversationId: string; userId: string; upToMessageId: string }) => void;
  'conversation:updated': (payload: { conversationId: string; participantIds: string[] }) => void;
}

class TypedEventBus extends EventEmitter {
  emit<K extends keyof DomainEvents>(event: K, ...args: Parameters<DomainEvents[K]>): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof DomainEvents>(event: K, listener: DomainEvents[K]): this {
    return super.on(event, listener as (...args: unknown[]) => void);
  }
}

export const domainEvents = new TypedEventBus();
