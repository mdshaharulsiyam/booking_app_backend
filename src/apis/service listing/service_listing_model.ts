

import { model, Schema } from "mongoose";
import { IService_listing } from "./service_listing_types";

const service_listing_schema = new Schema<IService_listing>({
  name: {
    type: String,
    required: [true, 'name is required'],
    unique: true
  },
  img: {
    type: [String],
    required: [true, 'img is required']
  },
  category: {
    type: Schema.Types.ObjectId,
    required: [true, 'category is required'],
    ref: "category"
  },
  sub_category: {
    type: Schema.Types.ObjectId,
    required: [true, 'sub category is required'],
    ref: "services"
  },
  description: {
    type: String,
    required: [true, 'description is required']
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'user is required'],
    ref: "auth"
  },
  business: {
    type: Schema.Types.ObjectId,
    required: [true, 'business is required'],
    ref: "business"
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
    min: [0, 'Price cannot be negative']
  }
}, { timestamps: true });

export const service_listing_model = model<IService_listing>("service_listing", service_listing_schema);


