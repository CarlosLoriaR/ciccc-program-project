import type { ReactNode } from 'react';
import { Link } from 'react-router';

type AuthCardProps = {
  activeTab: 'login' | 'signup';
  subtitle: string;
  children: ReactNode;
};

const AuthCard = ({ activeTab, subtitle, children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-outline-variant shadow-sm px-8 pb-8 pt-5">
      <div className="text-center mb-6">
        <p className="text-on-surface-variant mt-1 font-bold text-xl">
          {subtitle}
        </p>
      </div>

      <div className="flex bg-surface-container-low rounded-full p-1 mb-7">
        <Link
          to="/auth/login"
          className={`flex-1 text-center py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === 'login' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
        >
          Login
        </Link>

        <Link
          to="/auth/signup"
          className={`flex-1 text-center py-2.5 rounded-full text-sm font-bold transition-colors ${activeTab === 'signup' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}
        >
          Signup
        </Link>
      </div>
      {children}
    </div>
  );
};

export default AuthCard;
