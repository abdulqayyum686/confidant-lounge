const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
      required: false,
      default: null,
    },
    bio: {
      type: String,
      required: false,
      default: null,
    },
    userName: {
      type: String,
    },
    confirmEmail: {
      type: String,
    },
    forgotToken: {
      type: String,
    },
    isForgotTokenUsed: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", userSchema);
