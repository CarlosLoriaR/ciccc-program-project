import { Request, Response } from 'express';
import { asyncHandler } from '../../common/utils/asyncHandler';
import { created, noContent, ok } from '../../common/utils/apiResponse';
import * as rideService from './ride.service';
import * as bookingService from './rideBooking.service';
import { parsePageParams } from '../../common/utils/pagination';
import { SearchRidesQuery } from './ride.validation';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const ride = await rideService.createRide(req.user!.id, req.body);
  created(res, ride);
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query as unknown as SearchRidesQuery;
  const pageParams = parsePageParams(query, query.limit, 100);
  const result = await rideService.searchRides({ ...pageParams, ...query });
  ok(res, result);
});

export const listMine = asyncHandler(async (req: Request, res: Response) => {
  const rides = await rideService.listMyRides(req.user!.id);
  ok(res, rides);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const ride = await rideService.getRideById(req.params.id);
  ok(res, ride);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const ride = await rideService.updateRide(req.params.id, req.user!.id, req.body);
  ok(res, ride);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await rideService.cancelRide(req.params.id, req.user!.id);
  noContent(res);
});

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.createBooking(req.params.id, req.user!.id, req.body);
  created(res, booking);
});

export const listBookingsForRide = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.listBookingsForRide(req.params.id, req.user!.id);
  ok(res, bookings);
});

export const listMyBookings = asyncHandler(async (req: Request, res: Response) => {
  const bookings = await bookingService.listMyBookings(req.user!.id);
  ok(res, bookings);
});

export const updateBooking = asyncHandler(async (req: Request, res: Response) => {
  const booking = await bookingService.updateBooking(req.params.id, req.user!.id, req.body);
  ok(res, booking);
});
