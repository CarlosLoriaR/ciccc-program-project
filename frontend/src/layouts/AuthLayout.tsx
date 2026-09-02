import { IoMdTrain } from 'react-icons/io';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <main className="min-h-screen overflow-y-auto flex flex-col items-center bg-surface pt-12 pb- gap-10 px-4">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2">
          <IoMdTrain size={38} className="text-primary" />
          <h1 className="text-[3rem] font-bold text-primary leading-none">
            Commutual
          </h1>
        </div>
        <p className="text-on-surface-variant mt-1 text-lg">
          Connecting journeys, one ride at a time.
        </p>
      </div>
      <Outlet />
    </main>
  );
};

export default AuthLayout;
