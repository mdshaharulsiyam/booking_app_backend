

import mongoose, { model } from 'mongoose';
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { service_listing_model } from "./service_listing_model";
import { service_model } from '../Service/service_model';
import { IAuth } from '../Auth/auth_types';
import bcrypt from 'bcrypt'
import Aggregator from '../../utils/Aggregator';

const create =async(data: { [key: string]: string })=> {
    const result = await service_listing_model.create(data)
    return {
        success: true,
        message: 'service_listing created successfully',
        data: result
    }
}

const get_all = async(queryKeys: QueryKeys, searchKeys: SearchKeys)=> {
    return await Aggregator(service_listing_model, queryKeys, searchKeys, [])
}

const update=async(id: string, data: { [key: string]: string }) =>{
    const result = await service_listing_model.findByIdAndUpdate(id, {
        $set: {
            ...data
        }
    }, { new: true })

    return {
        success: true,
        message: 'service_listing updated successfully',
        data: result
    }
}

const delete_service_listing=async(id: string, data: { [key: string]: string }, auth: IAuth)=> {

    const is_exists = await service_listing_model.findOne({ _id: id, name: data?.name })

    if (!is_exists) throw new Error("service_listing not found")

    const is_pass_mass = await bcrypt.compare(data?.password, auth?.password)

    if (!is_pass_mass) throw new Error("password doesn't match")

const session = await mongoose.startSession();
try {
  const result = await session.withTransaction(async () => {
    const [result] = await Promise.all([
      service_listing_model.findByIdAndDelete(id, { session }),
      service_model.deleteMany({ service_listing: id }, { session }),
            ])
  return result
})
return {
  success: true,
  message: 'service_listing deleted successfully',
  data: result
}
    } catch (error) {
  throw error;
} finally {
  await session.endSession();
}
}

export const service_listing_service = Object.freeze({
  create,
  get_all,
  update,
  delete_service_listing
})  
    