const app = require(`${__dirname}/app`);
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT || 5000;
app.listen(port, process.env.HOST, () => {
  console.log(`server started listening on port ${port}`);
});

mongoose
  .connect(process.env.URI)
  .then(() => {
    console.log("Database connected Successfully");
  })
  .catch(() => {
    console.log("Database connection Failed");
  });
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "Hello world request" });
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  //listen.close();
});