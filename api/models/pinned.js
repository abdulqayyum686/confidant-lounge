const mongoose = require("mongoose");

const pinnedSchema = mongoose.Schema(
  {
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articles",
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GameReview",
    },
    pinnedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pinned", pinnedSchema);
