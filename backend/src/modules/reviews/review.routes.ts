import { Router } from 'express';
import * as reviewController from './review.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { createReviewSchema } from './review.validation';

const router = Router();

router.use(requireAuth);

router.post('/', validate({ body: createReviewSchema }), reviewController.create);
router.get('/:id', reviewController.getById);

export default router;
