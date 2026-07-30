import { IRide, RideModel } from './ride.model';
import { ForbiddenError, NotFoundError } from '../../common/errors/httpErrors';
import { nearQuery } from '../../common/utils/geo';
import { PageParams, toPagedResult } from '../../common/utils/pagination';
import { CreateRideInput, SearchRidesQuery, UpdateRideInput } from './ride.validation';
import { cancelBookingsForRide } from './rideBooking.service';

export async function createRide(driverId: string, input: CreateRideInput): Promise<IRide> {
  return RideModel.create({ ...input, driver_id: driverId });
}

export async function listMyRides(driverId: string): Promise<IRide[]> {
  return RideModel.find({ driver_id: driverId }).sort({ departure_datetime: -1 });
}

export async function getRideById(rideId: string): Promise<IRide> {
  const ride = await RideModel.findById(rideId);
  if (!ride) throw new NotFoundError('Ride not found');
  return ride;
}

export async function updateRide(rideId: string, driverId: string, patch: UpdateRideInput): Promise<IRide> {
  const ride = await getRideById(rideId);
  if (ride.driver_id.toString() !== driverId) throw new ForbiddenError('You do not own this ride');

  Object.assign(ride, patch);
  await ride.save();
  return ride;
}

export async function cancelRide(rideId: string, driverId: string): Promise<void> {
  const ride = await getRideById(rideId);
  if (ride.driver_id.toString() !== driverId) throw new ForbiddenError('You do not own this ride');

  ride.status = 'cancelled';
  await ride.save();
  await cancelBookingsForRide(ride._id.toString());
}

export interface SearchParams extends PageParams, Omit<SearchRidesQuery, 'page' | 'limit'> {}

export async function searchRides(params: SearchParams) {
  const filter: Record<string, unknown> = {
    status: 'scheduled',
    $expr: { $gte: [{ $subtract: ['$seats_total', '$seats_taken'] }, params.minSeats] },
    ...nearQuery('origin', [params.originLng, params.originLat], params.radiusKm),
    ...nearQuery('destination', [params.destinationLng, params.destinationLat], params.radiusKm),
  };

  if (params.date) {
    const start = new Date(params.date);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.departure_datetime = { $gte: start, $lt: end };
  }

  const [items, total] = await Promise.all([
    RideModel.find(filter)
      .populate('driver_id', 'full_name display_name avatar_url rating_avg rating_count')
      .skip(params.skip)
      .limit(params.limit)
      .sort({ departure_datetime: 1 }),
    RideModel.countDocuments(filter),
  ]);

  return toPagedResult(items, total, params);
}
