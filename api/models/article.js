const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    file: {
      type: String,
    },
    link: {
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

module.exports = mongoose.model("Articles", articleSchema);
