const mongoose = require("mongoose");

const contextSchema = mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
  belongsTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  link:{
    type:String
    }
});

module.exports = mongoose.model("Context", contextSchema);
