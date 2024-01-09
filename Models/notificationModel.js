const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.ObjectId, ref: "User" },
    receivers: {
      type: [mongoose.Schema.ObjectId],
      ref: "User",
      required: [true, "Please, select the target users"],
    },
    subject: {
      type: String,
      required: [true, "Sorry,Each notification must have a subject."],
    },
    description: { type: String },
    images: { type: [String] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("notifications", notificationSchema);
