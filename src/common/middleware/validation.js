import { z } from 'zod'
import { langEnum } from '../enums/index.js'

// fallback for messages we didn't write ourselves (missing field, unknown key, ...)
const arLocaleError = z.locales.ar().localeError

export const validation = (schema) => {
   return (req, res, next) => {
      const firstLang = String(req.headers['accept-language'] ?? '').split(',')[0].trim()
      const lang = firstLang === String(langEnum.ar) ? langEnum.ar : langEnum.en
      const zodSchema = typeof schema === 'function' ? schema(lang) : schema
      let { success, error, data } = zodSchema.safeParse({
         params: req.params,
         body: req.body,
         query: req.query,
         headers: req.headers
      }, lang === langEnum.ar ? { error: arLocaleError } : undefined)
      if (!success) {
         throw error
      }
      req.validate = data
      next()
   }
}
