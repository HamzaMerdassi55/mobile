const express = require("express");
const moragan = require("morgan");
const globalErrorHandler = require(`${__dirname}/Controller/errorController`);
const AppError = require(`${__dirname}/utils/appError`);
const app = express();

const userRouter = require(`${__dirname}/routes/userRouter.js`);
const notificationRouter = require(`${__dirname}/routes/notificationRouter`);
const evenmentRoute = require(`${__dirname}/routes/evenmentRouter`);

app.use(express.static(`${__dirname}/uploads`));
app.use(express.json({}));
app.use(moragan("dev"));
app.use("/api/user", userRouter);
app.use("/api/notification", notificationRouter);
app.use('/api/evenment', evenmentRoute);


app.use("*", (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});
app.use(globalErrorHandler);
module.exports = app;
