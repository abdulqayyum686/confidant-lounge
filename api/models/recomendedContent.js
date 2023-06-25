const mongoose = require("mongoose");

const recomendedContentSchema = mongoose.Schema(
  {
    link: {
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

module.exports = mongoose.model("RecomendedContent", recomendedContentSchema);
