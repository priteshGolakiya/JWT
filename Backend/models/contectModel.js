const mongoose = require("mongoose");

const ContectSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      require: [true, "Email is required"],
    },
    phone: {
      type: String,
      require: [true, "Phone number is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contect", ContectSchema);
