

import { Document, Types } from "mongoose";

export interface IBooking extends Document {
  business: Types.ObjectId,
  user: Types.ObjectId,
  services: [Types.ObjectId];
  date: Date;
  startTime: Date;
  endTime: Date;
  Day: string;
  status: [IStatus]
  statusUpdatedBy: "USER" | 'ADMIN' | "SUPER_ADMIN" | "BUSINESS",
  acceptedBy?: Types.ObjectId,
  address: string
  location: {
    type: 'Point';
    coordinates: [number, number];
  }
  createdAt: Date;
  updatedAt: Date;
}

export interface IStatus {
  status: 'requested' | "accepted" | 'working' | 'competed' | 'canceled',
  time: Date
}