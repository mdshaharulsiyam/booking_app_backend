

import { model, Schema } from "mongoose";
import config from '../../DefaultConfig/config';
import { IBooking, IStatus } from "./booking_types";

const statusSchema = new Schema<IStatus>(
  {
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: [
        'requested',
        'accepted',
        'assigned',
        'working',
        'competed',
        'canceled',
      ],
    },
    time: {
      type: Date,
      required: [true, 'Time is required'],
    },
  },
  { _id: false }
);

const booking_schema = new Schema<IBooking>(
  {
    business: {
      type: Schema.Types.ObjectId,
      ref: 'auth',
      required: [true, 'Business ID is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'auth',
      required: [true, 'User ID is required'],
    },
    acceptedBy: {
      type: Schema.Types.ObjectId,
      ref: 'auth',
      required: false,
      default: null,
    },
    services: [{
      type: Schema.Types.ObjectId,
      required: [true, 'At least one service must be provided'],
      ref: 'service'
    }],
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: Date,
      required: [true, 'End time is required'],
    },
    Day: {
      type: String,
      required: [true, 'Day is required'],
      enum: config.WEEK,
    },
    status: {
      type: [statusSchema],
      default: [{
        status: 'requested',
        time: new Date(),
      }],
    },
    statusUpdatedBy: {
      type: String,
      required: [true, 'Status updated by is required'],
      enum: config.USER,
      default: 'USER'
    },
    address: {
      type: String,
      required: [true, 'address is required for booking']
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: [
          {
            validator: function (value: number[]) {
              return (value.length === 2 &&
                value[0] >= -180 && value[0] <= 180 &&
                value[1] >= -90 && value[1] <= 90)

            },
            message: 'Coordinates must be valid longitude and latitude values.',
          },
        ],
      },
    },
  },
  { timestamps: true }
);

export const booking_model = model<IBooking>("booking", booking_schema);


