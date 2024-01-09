class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    //? it return the error file place and line in the app code
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
