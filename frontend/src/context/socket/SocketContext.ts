import { createContext } from 'react';
import type { Socket } from 'socket.io-client';

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});
