import { IReview, ReviewModel } from './review.model';
import { RideModel } from '../rides/ride.model';
import { RideBookingModel } from '../rides/rideBooking.model';
import { BadRequestError, ConflictError, NotFoundError } from '../../common/errors/httpErrors';
import { applyRatingUpdate } from '../users/user.service';
import { notify } from '../notifications/notification.service';
import { PageParams, toPagedResult } from '../../common/utils/pagination';
import { CreateReviewInput } from './review.validation';

async function wasOnRide(rideId: string, userId: string, driverId: string): Promise<boolean> {
  if (driverId === userId) return true;
  const booking = await RideBookingModel.exists({
    ride_id: rideId,
    passenger_id: userId,
    status: { $in: ['confirmed', 'completed'] },
  });
  return Boolean(booking);
}

export async function createReview(reviewerId: string, input: CreateReviewInput): Promise<IReview> {
  if (reviewerId === input.reviewee_id) throw new BadRequestError('You cannot review yourself');

  const ride = await RideModel.findById(input.ride_id);
  if (!ride) throw new NotFoundError('Ride not found');
  if (ride.status !== 'completed') throw new BadRequestError('You can only review completed rides');

  const driverId = ride.driver_id.toString();
  const [reviewerParticipated, revieweeParticipated] = await Promise.all([
    wasOnRide(input.ride_id, reviewerId, driverId),
    wasOnRide(input.ride_id, input.reviewee_id, driverId),
  ]);
  if (!reviewerParticipated || !revieweeParticipated) {
    throw new BadRequestError('Both users must have been on this ride');
  }

  const existing = await ReviewModel.findOne({
    reviewer_id: reviewerId,
    reviewee_id: input.reviewee_id,
    ride_id: input.ride_id,
  });
  if (existing) throw new ConflictError('You already reviewed this person for this ride');

  const review = await ReviewModel.create({
    reviewer_id: reviewerId,
    reviewee_id: input.reviewee_id,
    ride_id: input.ride_id,
    rating: input.rating,
    comment: input.comment,
  });

  await applyRatingUpdate(input.reviewee_id, input.rating);
  await notify(input.reviewee_id, 'review_received', 'New review', 'You received a new rating', {
    reviewId: review._id.toString(),
  });

  return review;
}

export async function listReviewsForUser(userId: string, params: PageParams) {
  const filter = { reviewee_id: userId };
  const [items, total] = await Promise.all([
    ReviewModel.find(filter)
      .populate('reviewer_id', 'full_name display_name avatar_url')
      .sort({ created_at: -1 })
      .skip(params.skip)
      .limit(params.limit),
    ReviewModel.countDocuments(filter),
  ]);
  return toPagedResult(items, total, params);
}

export async function getReviewById(reviewId: string): Promise<IReview> {
  const review = await ReviewModel.findById(reviewId);
  if (!review) throw new NotFoundError('Review not found');
  return review;
}
