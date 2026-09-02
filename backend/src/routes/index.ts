import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import commuteRoutes from '../modules/commutes/commute.routes';
import matchRoutes from '../modules/matches/match.routes';
import conversationRoutes from '../modules/conversations/conversation.routes';
import rideRoutes from '../modules/rides/ride.routes';
import bookingRoutes from '../modules/rides/booking.routes';
import reviewRoutes from '../modules/reviews/review.routes';
import notificationRoutes from '../modules/notifications/notification.routes';
import reportRoutes from '../modules/reports/report.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/commutes', commuteRoutes);
router.use('/matches', matchRoutes);
router.use('/conversations', conversationRoutes);
router.use('/rides', rideRoutes);
router.use('/bookings', bookingRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);

export default router;
