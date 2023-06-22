const mongoose = require("mongoose");

const gameNewReviewTypeSchema = mongoose.Schema({
  newReviewType: {
    type: String,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("newReviewType", gameNewReviewTypeSchema);
