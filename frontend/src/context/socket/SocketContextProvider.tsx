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
      return;
    }

    const newSocket = io(SOCKET_URL, {
      // A callback, not a static object — refetches the token on every reconnect
      // instead of resending the one captured at login, which expires after 15 min.
      auth: (cb) => cb({ token: localStorage.getItem('token') }),
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection failed:', err.message);
      setIsConnected(false);
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [token, isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
