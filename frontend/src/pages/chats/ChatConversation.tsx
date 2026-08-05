import { IoSend } from 'react-icons/io5';
import { useParams } from 'react-router';
import { useAuth } from '../../context/auth/useAuth';
import { useSocket } from '../../context/socket/useSocket';
import { useEffect, useRef, useState } from 'react';
import type { Message } from '../../types/chat';
import { listMessages } from '../../lib/conversations';

const ChatConversation = () => {
  const { conversationId } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    const load = async () => {
      try {
        const data = await listMessages(conversationId);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };
    load();
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit('conversation:join', { conversationId });

    const handleNewMessage = ({ message }: { message: Message }) => {
      if (message.conversation_id === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('message:new', handleNewMessage);

    return () => {
      socket.emit('conversation:leave', { conversationId });
      socket.off('message: new', handleNewMessage);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !socket || !conversationId) return;

    socket.emit('message:send', { conversationId, body: draft.trim() });
    setDraft('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          const isOwn = message.sender_id === user?._id;
          return (
            <div
              key={message._id}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isOwn
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-low text-on-surface'
                }`}
              >
                {message.body}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 p-3 border-t border-outline-variant bg-surface-container-low"
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2.5 bg-surface-container-low rounded-full text-on-surface placeholder:text-outline focus:outline-none"
        />
        <button
          type="submit"
          className="bg-primary text-on-primary rounded-full p-2.5 hover:bg-secondary transition-colors"
        >
          <IoSend size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatConversation;
