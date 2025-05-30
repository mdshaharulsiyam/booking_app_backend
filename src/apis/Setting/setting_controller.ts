import { Request, Response } from "express";
import { setting_service } from "./setting_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";

async function create(req: Request, res: Response) {
  const result = await setting_service.create(req.body);

  sendResponse(res, HttpStatus.SUCCESS, result);
}

const create_web_setting = async (req: Request, res: Response) => {
  const result = await setting_service.create_web_setting(req?.body);
  sendResponse(res, HttpStatus.SUCCESS, result);
};

async function get(req: Request, res: Response) {
  const result = await setting_service.get(req?.params?.name);

  sendResponse(res, HttpStatus.SUCCESS, result);
}

async function get_web_setting(req: Request, res: Response) {
  const result = await setting_service.get_web_setting();

  sendResponse(res, HttpStatus.SUCCESS, result);
}

export const setting_controller = Object.freeze({
  create,
  get,
  create_web_setting,
  get_web_setting,
});
