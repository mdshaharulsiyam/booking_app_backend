import mongoose, { model } from "mongoose";
import Queries, { QueryKeys, SearchKeys } from "../../utils/Queries";
import { category_model } from "./category_model";
import { service_model } from "../Service/service_model";
import { IAuth } from "../Auth/auth_types";
import bcrypt from "bcrypt";
import Aggregator from "../../utils/Aggregator";
import { UnlinkFiles } from "../../middleware/fileUploader";
async function create(data: { [key: string]: string }) {
  const result = await category_model.create(data);
  return {
    success: true,
    message: "category created successfully",
    data: result,
  };
}

async function get_all(queryKeys: QueryKeys, searchKeys: SearchKeys) {
  return await Aggregator(category_model, queryKeys, searchKeys, []);
}

async function update(id: string, data: { [key: string]: string }) {
  const category = await category_model.findById(id);

  if (!category) throw new Error("category not found");
  if (data?.img) UnlinkFiles([category?.img]);

  const result = await category_model.updateOne(
    { _id: id },
    {
      $set: {
        ...data,
      },
    },
    { new: true },
  );

  return {
    success: true,
    message: "category updated successfully",
    data: result,
  };
}

async function delete_category(
  id: string,
  data: { [key: string]: string },
  auth: IAuth,
) {
  const is_exists = await category_model.findOne({ _id: id, name: data?.name });

  if (!is_exists) throw new Error(`category not found`);

  const is_pass_mass = await bcrypt.compare(data?.password, auth?.password);

  if (!is_pass_mass) throw new Error(`password doesn't match`);

  const session = await mongoose.startSession();
  await session.startTransaction();

  try {
    const [result] = await Promise.all([
      category_model.findByIdAndDelete(id, { session }),
      service_model.deleteMany({ category: id }, { session }),
    ]);
    return {
      success: true,
      message: "category deleted successfully",
      data: result,
    };
  } catch (error) {
    await session.startTransaction();
  } finally {
    await session.endSession();
  }
}

export const category_service = Object.freeze({
  create,
  get_all,
  update,
  delete_category,
});
