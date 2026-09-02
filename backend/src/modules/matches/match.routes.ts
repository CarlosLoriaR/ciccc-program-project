import { Router } from 'express';
import * as matchController from './match.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { createMatchSchema, listMatchesQuerySchema, respondMatchSchema } from './match.validation';

const router = Router();

router.use(requireAuth);

router.post('/', validate({ body: createMatchSchema }), matchController.create);
router.get('/', validate({ query: listMatchesQuerySchema }), matchController.list);
router.get('/:id', matchController.getById);
router.patch('/:id/respond', validate({ body: respondMatchSchema }), matchController.respond);
router.delete('/:id', matchController.cancel);

export default router;
