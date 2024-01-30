const Review = require("../models/Review");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const findReviews = async (user_id, album_id) => {
  let query = {};
  if (user_id) {
    const user = await User.findOne({ id: user_id }).lean().exec();
    if (user) {
      query.user = user._id;
    } else {
      throw new Error("User not found");
    }
  }
  if (album_id) query.album_id = album_id;

  return await Review.find(query).populate("user").lean();
};

const getReviews = asyncHandler(async (req, res) => {
  const { user_id, album_id } = req.query;

  if (!user_id && !album_id) {
    return res.status(400).json({ message: "Missing user_id and album_id" });
  }

  const reviews = await findReviews(user_id, album_id);

  if (!reviews.length) {
    return res.status(404).json({ message: "No Reviews Found" });
  }
  res.json(reviews);
});

const createReview = asyncHandler(async (req, res) => {
  const { user_id, album_id, rating, text } = req.body;

  if (!user_id || !album_id) {
    return res
      .status(400)
      .json({ message: "user_id and album_id are required" });
  }

  const user = await User.findOne({ id: user_id }).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const duplicate = await Review.findOne({ user: user, album_id })
    .lean()
    .exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Review already exists for this album" });
  }

  await Review.create({ user: user._id, album_id, rating, text });
  res.status(201).json({ message: "Review created" });
});

const updateReview = asyncHandler(async (req, res) => {
  const { user_id, album_id, rating, text } = req.body;

  if (!user_id || !album_id) {
    return res
      .status(400)
      .json({ message: "user_id and album_id are required" });
  }

  const user = await User.findOne({ id: user_id }).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const review = await Review.findOne({ user: user, album_id }).exec();
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  const update = {};
  if (rating !== "") {
    update.rating = rating;
  } else {
    update.$unset = { rating: "" };
  }

  if (text !== "") {
    update.text = text;
  } else {
    update.$unset = { ...update.$unset, text: "" };
  }

  await Review.updateOne({ user: user._id, album_id }, update);

  res.json({ message: "Review updated" });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { user_id, album_id } = req.body;

  if (!user_id || !album_id) {
    return res
      .status(400)
      .json({ message: "user_id and album_id are required" });
  }

  const user = await User.findOne({ id: user_id }).lean().exec();
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const review = await Review.findOneAndDelete({
    user: user._id,
    album_id,
  }).exec();
  if (!review) {
    return res.status(404).json({ message: "Review not found" });
  }

  res.json({
    message: `Review deleted for user ${user_id}, album ${album_id}`,
  });
});

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
