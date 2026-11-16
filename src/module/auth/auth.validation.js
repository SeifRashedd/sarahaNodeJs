import { email, z } from 'zod'
import { genderEnum } from './../../common/index.js'
import { gf } from '../../common/index.js'


export const loginSchema = z.strictObject({
    email: z.email(),
    password: gf.password
})



export const signupSchema = loginSchema.extend({
    userName: z.string().min(5).includes(" "),
    phone: z.e164(),
    gender: z.enum(Object.values(genderEnum))
}
)
