import { Router } from 'express';
import * as reportController from './report.controller';
import { requireAuth, requireRole } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { createReportSchema, listReportsQuerySchema, resolveReportSchema } from './report.validation';

const router = Router();

router.use(requireAuth);

router.post('/', validate({ body: createReportSchema }), reportController.create);
router.get('/', requireRole('admin'), validate({ query: listReportsQuerySchema }), reportController.list);
router.patch('/:id', requireRole('admin'), validate({ body: resolveReportSchema }), reportController.resolve);

export default router;
