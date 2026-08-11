import AuthContextProvider from './auth/AuthContextProvider';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import SocketContextProvider from './socket/SocketContextProvider';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContextProvider>
      <SocketContextProvider>
        {children}
        <Toaster />
      </SocketContextProvider>
    </AuthContextProvider>
  );
};

export default Providers;
