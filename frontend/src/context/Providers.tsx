import AuthContextProvider from './auth/AuthContextProvider';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import SocketContextProvider from './socket/SocketContextProvider';
import NotificationContextProvider from './notifications/NotificationContextProvider';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        <NotificationContextProvider>
          {children}
          <Toaster />
        </NotificationContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  );
};

export default Providers;
