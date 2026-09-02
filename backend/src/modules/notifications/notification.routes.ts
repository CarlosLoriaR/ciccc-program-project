import { Router } from 'express';
import * as notificationController from './notification.controller';
import { requireAuth } from '../../common/middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', notificationController.list);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markRead);
router.delete('/:id', notificationController.remove);

export default router;
