import express, { Request } from "express";
import config from "../../DefaultConfig/config";
import asyncWrapper from "../../middleware/asyncWrapper";
import uploadFile from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import verifyToken from "../../middleware/verifyToken";
import { setting_service } from '../Setting/setting_service';
import { business_controller } from "./business_controller";
import { business_validate } from "./business_validate";
export const business_router = express.Router();

business_router
  .post(
    "/business/create",
    uploadFile(),
    validateRequest(business_validate.create_validate),
    verifyToken(config.USER, true, undefined, async (req: Request) => {
      const web_setting = await setting_service.get_web_setting();
      return { web_setting };
    }),
    asyncWrapper(business_controller.create),
  )

  .get("/business/get-all", asyncWrapper(business_controller.get_all))

  .patch(
    "/business/update/:id",
    uploadFile(),
    validateRequest(business_validate.update_validate),
    verifyToken(config.VENDOR),
    asyncWrapper(business_controller.update),
  )

  .delete(
    "/business/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(business_controller.delete_business),
  )

  .patch(
    "/business/approve/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(business_controller.approve_shop),
  )

  .patch(
    "/business/block/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(business_controller.block_shop),
  );
