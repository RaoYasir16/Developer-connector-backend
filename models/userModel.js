const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true, // this adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("User", userSchema);
