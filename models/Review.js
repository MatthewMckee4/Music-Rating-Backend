const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  album_id: { type: String, required: true },
  rating: { type: Number },
  text: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
