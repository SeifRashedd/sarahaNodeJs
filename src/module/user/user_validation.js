import { z } from 'zod'
import { gf } from '../../common/index.js'

export const userProfileSchema = (lang) => z.object({
    params: z.strictObject({
        userId: gf.id(lang)
    }),
    query: z.object({
        data: z.string().optional()
    })
})
