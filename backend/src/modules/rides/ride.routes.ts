import { Router } from 'express';
import * as rideController from './ride.controller';
import { requireAuth } from '../../common/middleware/auth';
import { validate } from '../../common/middleware/validate';
import {
  createBookingSchema,
  createRideSchema,
  searchRidesQuerySchema,
  updateRideSchema,
} from './ride.validation';

const router = Router();

router.use(requireAuth);

router.post('/', validate({ body: createRideSchema }), rideController.create);
router.get('/', validate({ query: searchRidesQuerySchema }), rideController.search);
router.get('/me', rideController.listMine);
router.get('/:id', rideController.getById);
router.patch('/:id', validate({ body: updateRideSchema }), rideController.update);
router.delete('/:id', rideController.remove);

router.post('/:id/bookings', validate({ body: createBookingSchema }), rideController.createBooking);
router.get('/:id/bookings', rideController.listBookingsForRide);

export default router;
