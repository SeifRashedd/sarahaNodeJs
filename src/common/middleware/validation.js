export const validation = (schema) => {
   return (req, res, next) => {
      let { success, error, data } = schema.safeParse({
         params: req.params,
         body: req.body,
         query: req.query,
         headers: req.headers
      })
      if (!success) {
         throw error
      }
      req.validate = data
      next()
   }


}