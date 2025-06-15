import { Request, Response } from "express";
import { HttpStatus } from "../../DefaultConfig/config";
import { SearchKeys } from "../../utils/Queries";
import { sendResponse } from "../../utils/sendResponse";
import { business_service } from "./business_service";

const create = async (req: Request, res: Response) => {
  // const web_setting = await setting_service.get_web_setting();
  // business_documents logo banner

  if (req.body.coordinates)
    req.body.location.coordinates = JSON.parse(req.body.coordinates);
  if (req?.user?.role != "ADMIN" && req.user?.role != "SUPER_ADMIN")
    req.body.user = req?.user?._id;

  req.body.logo = req.body.logo?.[0];
  req.body.banner = req.body.banner?.[0];
  req.body.address = JSON.parse(req.body.address || "{}");
  req.body.is_approve = req?.extra?.web_setting?.data?.auto_approve_vendor;

  const result = await business_service.create(req?.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const get_all = async (req: Request, res: Response) => {
  const { search, ...other_fields } = req.query;
  let searchKeys = {} as SearchKeys;

  let queryKeys = { ...other_fields };

  if (search) searchKeys.name = search as string;

  const populatePath = "user";

  const selectFields = "";
  const result = await business_service.get_all(
    queryKeys,
    searchKeys,
    populatePath,
    selectFields,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const update = async (req: Request, res: Response) => {

  req.body.logo = req.body.logo?.[0];
  req.body.banner = req.body.banner?.[0];

  if (req.body.logo) req.body.logo = req.body.logo?.[0];
  if (req.body.banner) req.body.banner = req.body.banner?.[0];
  if (req.body.coordinates)
    req.body.location.coordinates = JSON.parse(req.body.coordinates);
  if (req?.user?.role != "ADMIN" && req.user?.role != "SUPER_ADMIN")
    req.body.user = req?.user?._id;

  // req.body.is_approve = req?.extra?.web_setting?.data?.auto_approve_vendor;

  const result = await business_service.update(req?.params?.id, req?.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const delete_business = async (req: Request, res: Response) => {
  const result = await business_service.delete_business(
    req?.params?.id,
    req?.user?._id as string,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const approve_shop = async (req: Request, res: Response) => {
  const result = await business_service.approve_shop(
    req?.params?.id,
    req?.user?._id as string,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

const block_shop = async (req: Request, res: Response) => {
  const result = await business_service.block_shop(
    req?.params?.id,
    req?.user?._id as string,
  );

  sendResponse(res, HttpStatus.SUCCESS, result);
};

export const business_controller = Object.freeze({
  create,
  get_all,
  update,
  delete_business,
  approve_shop,
  block_shop,
});
