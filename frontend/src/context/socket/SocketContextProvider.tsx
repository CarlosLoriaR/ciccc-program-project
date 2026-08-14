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
      // Nothing to connect. If a socket existed from a previous authenticated state,
      // that earlier effect's own cleanup (below) already tore it down before this ran.
      return;
    }

    const newSocket = io(SOCKET_URL, {
      // A function, not a static object — Socket.IO calls this fresh on the initial
      // connect AND on every automatic reconnect (e.g. after the backend restarts, or
      // a network blip). With a plain `{ token }` object, reconnects kept resending the
      // token captured at login, which silently stops working once it expires (15 min)
      // even though REST calls keep working fine via the axios refresh interceptor —
      // this is what caused messages to stop arriving live until a manual reload.
      auth: (cb) => cb({ token: localStorage.getItem('token') }),
    });

    newSocket.on('connect', () => setIsConnected(true));
    newSocket.on('disconnect', () => setIsConnected(false));
    newSocket.on('connect_error', (err) => {
      console.error('Socket connection failed:', err.message);
      setIsConnected(false);
    });

    // This is the standard "connect to an external system, keep the instance" effect
    // pattern — there's no event to hang this off of instead, since the connection
    // itself doesn't exist until this line runs.
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
