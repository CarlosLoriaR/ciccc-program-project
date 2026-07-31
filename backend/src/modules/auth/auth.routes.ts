import { Router } from 'express';
import * as authController from './auth.controller';
import { validate } from '../../common/middleware/validate';
import { loginSchema, registerSchema } from './auth.validation';
import { authRateLimiter } from '../../common/middleware/rateLimiter';
import { requireAuth } from '../../common/middleware/auth';

const router = Router();

router.post('/register', authRateLimiter, validate({ body: registerSchema }), authController.register);
router.post('/login', authRateLimiter, validate({ body: loginSchema }), authController.login);
router.post('/refresh', authRateLimiter, authController.refresh);
router.post('/logout', authController.logout);
router.post('/logout-all', requireAuth, authController.logoutAll);

export default router;
