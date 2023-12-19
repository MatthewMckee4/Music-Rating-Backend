const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  album_id: { type: String, required: true },
  rating: { type: Number },
  text: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
