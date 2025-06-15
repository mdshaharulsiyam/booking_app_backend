

import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import config from '../../DefaultConfig/config';
import Aggregator from '../../utils/Aggregator';
import { QueryKeys, SearchKeys } from "../../utils/Queries";
import auth_model from '../Auth/auth_model';
import { IAuth } from '../Auth/auth_types';
import { business_model } from '../Business/business_model';
import { IBusiness } from '../Business/business_type';
import { service_listing_model } from '../service listing/service_listing_model';
import { IService_listing } from '../service listing/service_listing_types';
import { service_model } from '../Service/service_model';
import { booking_model } from "./booking_model";
import { IBooking } from './booking_types';
const validate_booking_request = (
  isExistingBooking: IBooking | null,
  requestedUser: IAuth | null,
  business: IBusiness | null,
  Day: string,
  endDate: Date,
  startDate: Date,
  startTime: string,
  services: IService_listing[]
) => {
  if (isExistingBooking) return "booking already exists for this time";
  if (!requestedUser) return "user not found or not verified";
  if (!business) return "business not found or not approved";
  if (startDate < new Date()) return "invalid start date";
  if (endDate <= startDate) return "invalid end date";
  if (business.availability[Day as keyof typeof business.availability].length === 0) return "business is not available on this day";
  if (new Date(business.availability[Day as keyof typeof business.availability][0] as string) > new Date(startTime)) return "business is not available during this time";
  if (services.length === 0) return "at least one service is required";
  const business_ids = services.map((service: IService_listing) => service.business.toString());
  const business_id = business._id as string;
  const invalid_business_ids = business_ids.filter((id: string) => id !== business_id.toString());
  if (invalid_business_ids.length > 0) return "services are not available for this business";
  return null;
}
const create = async (data: any, user: IAuth) => {
  const { startTime, endTime, status, coordinates, ...otherValues } = data;

  if (coordinates) {
    otherValues['location.coordinates'] = JSON.parse(coordinates);
  }
  const startDate = new Date(`${data.date} ${startTime}`);
  const endDate = new Date(`${data.date} ${endTime}`);
  const Day = config.WEEK[new Date(data.date).getDay()];

  const [isExistingBooking, requestedUser, business, services] = await Promise.all([
    booking_model.findOne({
      endTime: { $gte: startDate },
      startTime: { $lte: endDate },
      status: { $not: { $elemMatch: { status: 'canceled' } } },
    }),
    auth_model.findOne({
      _id: user._id,
      isVerified: true,
      block: false,
    }).select('_id role point user_type'),
    business_model.findOne({
      _id: otherValues?.business,
      is_approve: true,
      block: false,
    }),
    service_listing_model.find({
      _id: { $in: otherValues?.services || [] },
    })
  ]);
  const is_error = validate_booking_request(
    isExistingBooking?.toObject() || null,
    requestedUser?.toObject() || null,
    business?.toObject() || null,
    Day,
    endDate,
    startDate,
    startTime,
    services
  )
  if (is_error) throw new Error(is_error);

  const result = await booking_model.create({
    ...otherValues,
    price: services.reduce((acc, service) => acc + (service?.price || 0), 0),
    endTime: endDate,
    startTime: startDate,
    user: user?._id,
    Day,
  })
  return {
    success: true,
    message: 'booking created successfully',
    data: result
  }
}

const get_all = async (queryKeys: QueryKeys, searchKeys: SearchKeys) => {
  return await Aggregator(booking_model, queryKeys, searchKeys, [])
}

const update = async (id: string, data: { [key: string]: string }) => {
  const result = await booking_model.findByIdAndUpdate(id, {
    $set: {
      ...data
    }
  }, { new: true })

  return {
    success: true,
    message: 'booking updated successfully',
    data: result
  }
}

const delete_booking = async (id: string, data: { [key: string]: string }, auth: IAuth) => {

  const is_exists = await booking_model.findOne({ _id: id, name: data?.name })

  if (!is_exists) throw new Error("booking not found")

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password)

  if (!is_pass_mass) throw new Error("password doesn't match")

  const session = await mongoose.startSession();
  try {
    const result = await session.withTransaction(async () => {
      const [result] = await Promise.all([
        booking_model.findByIdAndDelete(id, { session }),
        service_model.deleteMany({ booking: id }, { session }),
      ])
      return result
    })
    return {
      success: true,
      message: 'booking deleted successfully',
      data: result
    }
  } catch (error) {
    throw error;
  } finally {
    await session.endSession();
  }
}

export const booking_service = Object.freeze({
  create,
  get_all,
  update,
  delete_booking
})
