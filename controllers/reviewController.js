const Review = require("../models/Review");
const asyncHandler = require("express-async-handler");

const getReviews = asyncHandler(async (req, res) => {
  const { album_id } = req.body;
  const reviews = await Review.find({ album_id: album_id }).lean();

  if (!reviews) {
    return res.status(400).json({ message: "No Reviews" });
  }
  res.json(reviews);
});

const createReview = asyncHandler(async (req, res) => {
  const { user_id, album_id, rating, text } = req.body;

  if (!user_id) {
    console.log("error getting user id");
  } else if (!album_id) {
    console.log("error getting album id");
  }

  const duplicate = await Review.findOne({ user_id, album_id }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Rewview already made for this album" });
  }

  const reviewObject = { user_id, album_id, rating, text };

  const review = await Review.create(reviewObject);

  if (review) {
    res.status(201).json({ message: "Review created" });
  } else {
    res.status(400).json({ message: "Review not created" });
  }
});

const updateReview = asyncHandler(async (req, res) => {
  const { user_id, album_id, rating, text } = req.body;
});

const deleteReview = asyncHandler(async (req, res) => {});

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
