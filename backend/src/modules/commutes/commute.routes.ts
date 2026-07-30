import { Router } from 'express';
import * as commuteController from './commute.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { createCommuteSchema, discoverCommutesQuerySchema, updateCommuteSchema } from './commute.validation';

const router = Router();

router.use(requireAuth);

router.post('/', validate({ body: createCommuteSchema }), commuteController.create);
router.get('/me', commuteController.listMine);
router.get('/discover', validate({ query: discoverCommutesQuerySchema }), commuteController.discover);
router.get('/:id', commuteController.getById);
router.patch('/:id', validate({ body: updateCommuteSchema }), commuteController.update);
router.delete('/:id', commuteController.remove);

export default router;
