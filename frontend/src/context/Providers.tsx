import AuthContextProvider from './auth/AuthContextProvider';
import type { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <AuthContextProvider>
      {children}
      <Toaster />
    </AuthContextProvider>
  );
};

export default Providers;
