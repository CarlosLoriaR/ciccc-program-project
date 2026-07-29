import { UserRole, UserStatus } from '../../config/constants';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        status: UserStatus;
      };
    }
  }
}

export {};
