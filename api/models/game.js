const mongoose = require("mongoose");

const gameSchema = mongoose.Schema(
  {
    reviewIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GameReview",
        default: [],
      },
    ],
    title: {
      type: String,
    },
    name: {
      type: String,
    },
    platform: {
      type: String,
    },
    releaseYear: {
      type: String,
    },
    contentType: {
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

module.exports = mongoose.model("Game", gameSchema);
