const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  id: { type: String, required: true },
  image: { type: String },
});

module.exports = mongoose.model("User", userSchema);
