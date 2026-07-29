import { Router } from 'express';
import * as rideController from './ride.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import { updateBookingSchema } from './ride.validation';

const router = Router();

router.use(requireAuth);

router.get('/me', rideController.listMyBookings);
router.patch('/:id', validate({ body: updateBookingSchema }), rideController.updateBooking);

export default router;
