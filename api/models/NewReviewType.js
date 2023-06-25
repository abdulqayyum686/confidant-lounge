const mongoose = require("mongoose");

const gameNewReviewTypeSchema = mongoose.Schema(
  {
    newReviewType: {
      type: String,
    },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("newReviewType", gameNewReviewTypeSchema);
