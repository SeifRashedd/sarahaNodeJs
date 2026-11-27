import { Router } from "express";
import * as ms from './message.service.js'
import { fileTypes, multerMiddleware, proccesFile, response, validation } from "../../common/index.js";
import { createMessageSchema } from "./message.validation.js";


export const messageRouter = Router()


messageRouter.post('/createMessage', multerMiddleware({
    storageFolder: 'message',
    types: [fileTypes.image]
}).array('attachments'),
    proccesFile([fileTypes.image], 'message'),
    validation(createMessageSchema)

    , async (req, res, next) => {

        let data = await ms.createMessage(req.validate.body , req.validate.files)
        response(res, 200, data, "Message send successfully");

    })

