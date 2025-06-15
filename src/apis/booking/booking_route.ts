
import express from 'express'
import asyncWrapper from '../../middleware/asyncWrapper';
import { booking_controller } from './booking_controller';
import verifyToken from '../../middleware/verifyToken';
import config from '../../DefaultConfig/config';
import uploadFile from '../../middleware/fileUploader';

export const booking_router = express.Router()

booking_router
    .post('/booking/create', verifyToken(config.ADMIN), uploadFile(), asyncWrapper(booking_controller.create))

    .get('/booking/get-all', asyncWrapper(booking_controller.get_all))

    .patch('/booking/update/:id', verifyToken(config.ADMIN), uploadFile(), asyncWrapper(booking_controller.update))

    .delete('/booking/delete/:id', verifyToken(config.ADMIN), asyncWrapper(booking_controller.delete_booking))
    
    