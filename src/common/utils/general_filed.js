import { z } from "zod"
import getErrorMessage, { keys } from "./get_error_message.js"
import { Types } from "mongoose"


export default {
    email: (lang) => z.email({ error: getErrorMessage(keys.invalidEmail, lang) }),
    password: (lang) => z.string()
        .min(5, { error: getErrorMessage(keys.shortPassword, lang) })
        .max(20, { error: getErrorMessage(keys.longPassword, lang) }),
    id: (lang) => z.string().regex(/^[0-9a-fA-F]{24}$/, { error: getErrorMessage(keys.invalidId, lang), abort: true }).refine(
        (data) => Types.ObjectId.isValid(data)
    ),
    file: (lang) => z.strictObject({
        fieldname: z.string(),
        originalname: z.string(),
        encoding: z.string(),
        mimetype: z.string(),
        size: z.number(),
        buffer: z.instanceof(Buffer).optional(),   // memoryStorage only
        path: z.string(),
        destination: z.string().optional(),        // diskStorage only
        filename: z.string().optional(),           // diskStorage only

    })
}
