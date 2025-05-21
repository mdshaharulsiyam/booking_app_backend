
import express, { Request } from 'express';
import config from '../../DefaultConfig/config';
import asyncWrapper from '../../middleware/asyncWrapper';
import uploadFile from '../../middleware/fileUploader';
import validateRequest from '../../middleware/validateRequest';
import verifyToken from '../../middleware/verifyToken';
import { business_model } from '../Business/business_model';
import { setting_service } from '../Setting/setting_service';
import { service_listing_controller } from './service_listing_controller';
import { service_listing_validate } from './service_listing_validate';

export const service_listing_router = express.Router()

service_listing_router
  .post('/service_listing/create',
    uploadFile(),
    validateRequest(service_listing_validate.create_validation),
    verifyToken(config.VENDOR, true, undefined, async (req: Request) => {
      const [web_setting, business] = await Promise.all([
        setting_service.get_web_setting(),
        business_model.findById(req?.body?.business),
      ])
      return { web_setting, business }
    }),
    asyncWrapper(service_listing_controller.create)
  )

  .get('/service_listing/get-all', asyncWrapper(service_listing_controller.get_all))

  .patch('/service_listing/update/:id', verifyToken(config.ADMIN), uploadFile(), asyncWrapper(service_listing_controller.update))

  .delete('/service_listing/delete/:id', verifyToken(config.ADMIN), asyncWrapper(service_listing_controller.delete_service_listing))

