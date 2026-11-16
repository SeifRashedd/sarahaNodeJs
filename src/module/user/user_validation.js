import mongoose from 'mongoose'
import { z } from 'zod'
import { gf } from '../../common/index.js'

export const userProfileSchema = z.object({
    params: z.strictObject({
        userId: gf.id
    }),
    query: z.strictObject({
        data: z.string()
    })
})
