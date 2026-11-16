import { z } from "zod"


export default {
    password: z.string().minLength(5, { error: "more than 5 characters" }).max(20, { error: "less than 20 characters" }),
    id: z.string().length(24)
}