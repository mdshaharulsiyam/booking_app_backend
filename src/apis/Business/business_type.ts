import { Document, Types } from "mongoose";

export interface IBusiness extends Document {
  user: Types.ObjectId;
  name: string;
  logo: string | null;
  banner: string;
  availability: {
    monday: [string] | [];
    tuesday: [string] | [];
    wednesday: [string] | [];
    thursday: [string] | [];
    friday: [string] | [];
    saturday: [string] | [];
    sunday: [string] | [];
  };
  address: {
    district: string;
    sub_district: string;
    union: string;
    post_office: string;
  };
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  block: boolean;
  is_approve: boolean;
  trade_license: string | null;
  business_category: "salon"
  | "restaurant"
  | "medical"
  | "fitness"
  | "services"
  | "other";
  business_sub_admins: Types.ObjectId[];
  business_documents: string[];
}
