
import { SearchKeys } from './../../utils/Queries';
import { Request, Response } from "express";
import { booking_service } from "./booking_service";
import { sendResponse } from "../../utils/sendResponse";
import { HttpStatus } from "../../DefaultConfig/config";
import { IAuth } from '../Auth/auth_types';

const create = async(req: Request, res: Response)=> {
    const img = !Array.isArray(req.files) && req.files?.img && req.files.img.length > 0 && req.files.img[0]?.path || null;

    if (img) req.body.img = img

    const result = await booking_service.create(req?.body)
    sendResponse(
        res,
        HttpStatus.CREATED,
        result
    )
}

const get_all=async(req: Request, res: Response)=> {

    const { search, ...otherValues } = req?.query;
    const searchKeys: SearchKeys = {}

    if (search) searchKeys.name = search as string

    const queryKeys = {
        ...otherValues
    }

    const result = await booking_service.get_all(queryKeys, searchKeys)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}


const update =async(req: Request, res: Response)=> {
    const img = !Array.isArray(req.files) && req.files?.img && req.files.img.length > 0 && req.files.img[0]?.path || null;

    if (img) req.body.img = img

    const result = await booking_service.update(req?.params?.id, req?.body)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

const delete_booking = async(req: Request, res: Response)=> {

    const result = await booking_service.delete_booking(req?.params?.id, req?.body, req?.user as IAuth)
    sendResponse(
        res,
        HttpStatus.SUCCESS,
        result
    )
}

export const booking_controller = {
    create,
    get_all,
    update,
    delete_booking
}
 