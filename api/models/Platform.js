const mongoose = require("mongoose");

const gameNewPlatformSchema = mongoose.Schema({
  newPlatform: {
    type: String,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});

module.exports = mongoose.model("newPlatform", gameNewPlatformSchema);
