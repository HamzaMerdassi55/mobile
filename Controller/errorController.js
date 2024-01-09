const AppError = require(`${__dirname}/../utils/appError`);
const handleCastObjectError = (err) => {
  return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
};
const handleDuplicationFieldError = (err) => {
  const obj = Object.entries(err.keyValue);
  const [firstKey, firstValue] = obj[0];

  return new AppError(
    `Duplicate filed value'${firstKey}'. Please try to set another value!`,
    400
  );
};
const handleValidationError = (err) => {
  const errorMessages = Object.values(err.errors).map(
    (item) => `- ${item.value}: ${item.message} \n`
  );
  const message =
    Object.keys(err).length === 1 ? errorMessages[0] : errorMessages.join(", ");
  return new AppError(`${err.name}: ${message}.`, 400);
};
const handleTokenExpirationError = (err) => {
  return new AppError("Your token expired! Please login again", 401);
};
const handleTokenValidationError = (err) => {
  return new AppError("Invalid token. Please log in again!", 400);
};
//? Production & Development Environment
const generateDevelopmentError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    err,
  });
};
const generateProductionError = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("error 🎇", err);
    return res.status(500).json({
      message: "Something goes Wrong!",
    });
  }
};
//?Global Error Handlers
module.exports = async (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.ENV === "development") {
    generateDevelopmentError(err, res);
  } else if (process.env.ENV === "production") {
    if (err.name === "CastError") err = handleCastObjectError(err);
    if (err?.code === 11000) err = handleDuplicationFieldError(err);
    if (err.name === "ValidationError") err = handleValidationError(err);
    if (err.name === "JsonWebTokenError") err = handleTokenValidationError(err);
    if (err.name === "TokenExpiredError") err = handleTokenExpirationError(err);
    generateProductionError(err, res);
  }
};
