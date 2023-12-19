const Review = require("../models/Review");
const asyncHandler = require("express-async-handler");

const findReviews = async (user_id, album_id) => {
  let query = {};
  if (user_id) query.user_id = user_id;
  if (album_id) query.album_id = album_id;

  return await Review.find(query).lean();
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

  const duplicate = await Review.findOne({ user_id, album_id }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Review already exists for this album" });
  }

  await Review.create({ user_id, album_id, rating, text });
  res.status(201).json({ message: "Review created" });
});

const updateReview = asyncHandler(async (req, res) => {
  const { user_id, album_id, rating, text } = req.body;
  console.log(req.body);

  if (!user_id || !album_id) {
    return res
      .status(400)
      .json({ message: "user_id and album_id are required" });
  }

  const review = await Review.findOne({ user_id, album_id }).exec();
  if (!review) {
    return res.status(400).json({ message: "Review not found" });
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

  await Review.updateOne({ user_id, album_id }, update);

  res.json({ message: "Review updated" });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { user_id, album_id } = req.body;

  if (!user_id || !album_id) {
    return res
      .status(400)
      .json({ message: "user_id and album_id are required" });
  }

  const review = await Review.findOneAndDelete({ user_id, album_id }).exec();
  if (!review) {
    return res.status(400).json({ message: "Review not found" });
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
