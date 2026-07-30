import { Router } from 'express';
import * as userController from './user.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { updateLocationSchema, updateProfileSchema } from './user.validation';
import { getReviewsForUser } from '../reviews/review.controller';

const router = Router();

router.use(requireAuth);

router.get('/me', userController.getMe);
router.patch('/me', validate({ body: updateProfileSchema }), userController.updateMe);
router.patch('/me/location', validate({ body: updateLocationSchema }), userController.updateMyLocation);
router.delete('/me', userController.deleteMe);
router.get('/:id/reviews', getReviewsForUser);
router.get('/:id', userController.getById);

export default router;
