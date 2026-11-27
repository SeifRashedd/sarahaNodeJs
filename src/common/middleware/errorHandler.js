import { ZodError } from "zod";

export const errHandler = (err, req, res, next) => {
  console.error("Request Error:", err);
  if (err instanceof ZodError) {
    try {
      err.message = JSON.parse(err.message)
    } catch {
      err.message = err.issues || err.message
    }
    err.status = 400
  }
  if (err.name === "MulterError") err.status = 400
  res.status(typeof err.cause === "number" ? err.cause : err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack })
  });
}
