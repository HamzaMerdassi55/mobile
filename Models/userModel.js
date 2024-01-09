const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "User must have a 'Nom'."],
    },
    prenom: {
      type: String,
      required: [true, "User must have a 'Prenom'."],
    },
    email: {
      type: String,
      required: [true, "User must have a 'Email'."],
      lowercase: true,
    },
    cin: {
      type: Number,
      required: [true, "User must have a 'Cin'."],
      unique: true,
      validate: {
        validator: function (val) {
          return val.toString().length == 8;
        },
        message:"Your cin length must be equal to 8."
      },
    },
    departement: {
      type: String,
      required: [true, "User must have a 'Departement'."],
    },
    niveau: {
      type: String,
      required: [true, "User must have a 'Level'."],
    },
    groupe: {
      type: String,
      required: [true, "User must have a 'Group'."],
    },
    telephone: {
      type: String,
      required: [true, "User must have a 'Number Phone'."],
      validate: {
        validator: function (val) {
          return val.toString().length == 8;
        },
        message:"Your phone number length must be equal to 8."
      },
    },
    role: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
