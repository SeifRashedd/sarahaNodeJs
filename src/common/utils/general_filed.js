import { z } from "zod"
import getErrorMessage , {keys} from "./get_error_message.js"


export default {
    email: (lang) => z.email({ error: getErrorMessage(keys.invalidEmail, lang) }),
    password: (lang) => z.string()
        .min(5, { error: getErrorMessage(keys.shortPassword, lang) })
        .max(20, { error: getErrorMessage(keys.longPassword, lang) }),
    id: (lang) => z.string().regex(/^[0-9a-fA-F]{24}$/, { error: getErrorMessage(keys.invalidId, lang) })
}
