const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your Name"],
      trim: true,
    },
    email: {
      type: String,
      unique: [true, "Email already in use."],
      trim: true,
      required: [true, "Please enter your email"],
    },
    password: {
      type: String,
      trim: true,
      required: [true, "Please provide a password"],
      minlength: [6, "Password should be at least 6 letters"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
