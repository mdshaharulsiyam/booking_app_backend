import express from "express";
import asyncWrapper from "../../middleware/asyncWrapper";
import { category_controller } from "./category_controller";
import verifyToken from "../../middleware/verifyToken";
import config from "../../DefaultConfig/config";
import uploadFile from "../../middleware/fileUploader";
import validateRequest from "../../middleware/validateRequest";
import { category_validate } from "./category_validate";

export const category_router = express.Router();

category_router
  .post(
    "/category/create",
    uploadFile(),
    validateRequest(category_validate.create_validate),
    verifyToken(config.ADMIN),
    asyncWrapper(category_controller.create),
  )

  .get("/category/get-all", asyncWrapper(category_controller.get_all))

  .patch(
    "/category/update/:id",
    uploadFile(),
    validateRequest(category_validate.update_validate),
    verifyToken(config.ADMIN),
    asyncWrapper(category_controller.update),
  )

  .delete(
    "/category/delete/:id",
    verifyToken(config.ADMIN),
    asyncWrapper(category_controller.delete_category),
  );
// ssh -i "C:\Users\BDcalling\Downloads\navid_shh1.pem" ubuntu@3.140.87.200