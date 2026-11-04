export const errHandler = (err, req, res, next) => {
  res.status(typeof err.cause === "number" ? err.cause : err.status || 500).json({
   message : err.message || "Internal Server Error",
   ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack })
  });
}
