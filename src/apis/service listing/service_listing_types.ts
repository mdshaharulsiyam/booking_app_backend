

import { Document, Types } from "mongoose";

export interface IService_listing extends Document {
  name: string;
  img: string[];
  category: Types.ObjectId;
  sub_category: Types.ObjectId;
  description: string;
  user: Types.ObjectId;
  business: Types.ObjectId;
}

