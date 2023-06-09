const mongoose = require("mongoose");

const gameReviewSchema = mongoose.Schema(
  {
    link: {
      type: String,
    },
    gameId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
    gameScore: {
      type: String,
    },
    reviewFile: {
      type: String,
    },
    reviewType: {
      type: String,
    },
    belongsTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    pinnedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GameReview", gameReviewSchema);
