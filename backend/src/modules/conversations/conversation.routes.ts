import { Router } from 'express';
import * as conversationController from './conversation.controller';
import * as messageController from '../messages/message.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { listMessagesQuerySchema, markReadSchema, sendMessageSchema } from '../messages/message.validation';

const router = Router();

router.use(requireAuth);

router.get('/', conversationController.list);
router.get('/:id', conversationController.getById);

router.get('/:id/messages', validate({ query: listMessagesQuerySchema }), messageController.list);
router.post('/:id/messages', validate({ body: sendMessageSchema }), messageController.send);
router.patch('/:id/messages/read', validate({ body: markReadSchema }), messageController.markRead);

export default router;
