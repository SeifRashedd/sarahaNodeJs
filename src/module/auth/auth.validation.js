import { z } from 'zod'
import { genderEnum, gf, getErrorMessage, keys } from '../../common/index.js'


const loginBody = (lang) => z.strictObject({
    email: gf.email(lang),
    password: gf.password(lang)
})

export const loginSchema = (lang) => z.object({
    body: loginBody(lang)
})

export const signupSchema = (lang) => z.object({
    body: loginBody(lang).extend({
        userName: z.string()
            .min(5, { error: getErrorMessage(keys.shortUserName, lang) })
            .includes(" ", { error: getErrorMessage(keys.fullUserName, lang) }),
        phone: z.e164({ error: getErrorMessage(keys.invalidPhone, lang) }),
        gender: z.enum(genderEnum, { error: getErrorMessage(keys.invalidGender, lang) })
    })
})
