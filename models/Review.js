const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  album_id: { type: Number, required: true },
  rating: {
    type: Number,
    validate: {
      validator: Number.isInteger,
      message: "{VALUE} is not an integer value",
    },
  },
  text: { type: String },
});

module.exports = mongoose.model("Review", reviewSchema);
