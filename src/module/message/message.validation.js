import { strictObject, z } from 'zod'
import { gf } from '../../common/index.js'

export let createMessageSchema = (lang) => z.object({
    body: z.strictObject({
        receiverId: gf.id(lang),
        senderId: gf.id(lang).optional(),
        content: z.string().min(5).max(5000).optional(),
    }),
    files: z.array(gf.file(lang)).optional()

}).superRefine(({ body, files }, ctx) => {
    if (files.length < 1 && !body.content) {
        ctx.addIssue({
            code: "custom",
            message: "message must have content or attachments",
            path: ["body", "content"]
        })
    }
})