const mongoose = require("mongoose");

const gameReviewSchema = mongoose.Schema({
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
  reviewType: {
    type: String,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("GameReview", gameReviewSchema);
