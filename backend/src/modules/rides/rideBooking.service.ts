import { IRideBooking, RideBookingModel } from './rideBooking.model';
import { RideModel } from './ride.model';
import { ConflictError, ForbiddenError, NotFoundError } from '../../common/errors/httpErrors';
import { notify } from '../notifications/notification.service';
import { CreateBookingInput, UpdateBookingInput } from './ride.validation';

export async function createBooking(
  rideId: string,
  passengerId: string,
  input: CreateBookingInput,
): Promise<IRideBooking> {
  const ride = await RideModel.findOneAndUpdate(
    {
      _id: rideId,
      status: 'scheduled',
      $expr: { $lte: [{ $add: ['$seats_taken', input.seats_booked] }, '$seats_total'] },
    },
    { $inc: { seats_taken: input.seats_booked } },
    { new: true },
  );

  if (!ride) {
    const exists = await RideModel.exists({ _id: rideId });
    if (!exists) throw new NotFoundError('Ride not found');
    throw new ConflictError('Not enough seats available on this ride');
  }

  const booking = await RideBookingModel.create({
    ride_id: rideId,
    passenger_id: passengerId,
    seats_booked: input.seats_booked,
    pickup_point: input.pickup_point,
    status: 'requested',
  });

  await notify(ride.driver_id.toString(), 'ride_booking', 'New booking request', 'Someone requested to join your ride', {
    rideId,
    bookingId: booking._id.toString(),
  });

  return booking;
}

export async function listBookingsForRide(rideId: string, driverId: string): Promise<IRideBooking[]> {
  const ride = await RideModel.findById(rideId);
  if (!ride) throw new NotFoundError('Ride not found');
  if (ride.driver_id.toString() !== driverId) throw new ForbiddenError('You do not own this ride');

  return RideBookingModel.find({ ride_id: rideId }).populate('passenger_id', 'full_name display_name avatar_url');
}

export async function listMyBookings(passengerId: string): Promise<IRideBooking[]> {
  return RideBookingModel.find({ passenger_id: passengerId })
    .populate('ride_id')
    .sort({ created_at: -1 });
}

async function releaseSeats(rideId: string, seats: number): Promise<void> {
  await RideModel.updateOne({ _id: rideId }, { $inc: { seats_taken: -seats } });
}

export async function updateBooking(
  bookingId: string,
  userId: string,
  input: UpdateBookingInput,
): Promise<IRideBooking> {
  const booking = await RideBookingModel.findById(bookingId);
  if (!booking) throw new NotFoundError('Booking not found');

  const ride = await RideModel.findById(booking.ride_id);
  if (!ride) throw new NotFoundError('Ride not found');

  if (input.action === 'cancel') {
    if (booking.passenger_id.toString() !== userId) throw new ForbiddenError('Only the passenger can cancel');
    if (booking.status === 'cancelled' || booking.status === 'declined') {
      throw new ConflictError('Booking already resolved');
    }
    booking.status = 'cancelled';
    await releaseSeats(ride._id.toString(), booking.seats_booked);
    await notify(ride.driver_id.toString(), 'ride_update', 'Booking cancelled', 'A passenger cancelled their booking', {
      rideId: ride._id.toString(),
    });
  } else {
    if (ride.driver_id.toString() !== userId) throw new ForbiddenError('Only the driver can respond to bookings');
    if (booking.status !== 'requested') throw new ConflictError('Booking already resolved');

    if (input.action === 'confirm') {
      booking.status = 'confirmed';
    } else {
      booking.status = 'declined';
      await releaseSeats(ride._id.toString(), booking.seats_booked);
    }
    await notify(
      booking.passenger_id.toString(),
      'ride_update',
      `Booking ${booking.status}`,
      `Your booking request was ${booking.status}`,
      { rideId: ride._id.toString() },
    );
  }

  await booking.save();
  return booking;
}

export async function cancelBookingsForRide(rideId: string): Promise<void> {
  const bookings = await RideBookingModel.find({ ride_id: rideId, status: { $in: ['requested', 'confirmed'] } });
  await Promise.all(
    bookings.map(async (booking) => {
      booking.status = 'cancelled';
      await booking.save();
      await notify(booking.passenger_id.toString(), 'ride_update', 'Ride cancelled', 'The driver cancelled this ride', {
        rideId,
      });
    }),
  );
}
