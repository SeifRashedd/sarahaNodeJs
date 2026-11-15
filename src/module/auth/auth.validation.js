import { email, z } from 'zod'


export const loginSchema = z.strictObject({
    email: z.email(),
    password: z.string()
})


export const signupSchema = loginSchema.extend({
    userName: z.string().min(5).includes(" "),
    phone: z.e164(),
    gender: z.int()

}
)