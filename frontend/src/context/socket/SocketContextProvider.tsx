import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../auth/useAuth';
import { SocketContext } from './SocketContext';
import { Socket, io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: { token },
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
