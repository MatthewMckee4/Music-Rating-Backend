const Review = require("../models/Review");
const asyncHandler = require("express-async-handler");

const getReviews = asyncHandler(async (req, res) => {
  const { user_id, album_id } = req.body;

  const reviews = await Review.find().lean();

  if (user_id && album_id) {
    reviews = await Review.find({ user_id, album_id }).lean();
  } else if (user_id) {
    reviews = await Review.find({ user_id }).lean();
  } else if (album_id) {
    reviews = await Review.find({ album_id }).lean();
  } else {
    return res
      .status(400)
      .json({ message: "Please provide user_id or album_id" });
  }

  if (!reviews || reviews.length === 0) {
    return res.status(400).json({ message: "No Reviews" });
  }

  res.json(reviews);
});

const createReview = asyncHandler(async (req, res) => {
  const { user_id, album_id, rating, text } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ message: "Review was not created, user id must be provided" });
  } else if (!album_id) {
    return res
      .status(400)
      .json({ message: "Review was not created, album id must be provided" });
  }

  const duplicate = await Review.findOne({ user_id, album_id }).lean().exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: "Review already made for this album" });
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

  if (!user_id || !album_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = await Review.findOne({ user_id, album_id }).exec();

  if (!review) {
    return res.status(400).json({ message: "Review not found" });
  }

  if (rating) {
    review.rating = rating;
  }

  if (text) {
    review.text = text;
  }

  await review.save();

  res.json({ message: "Review updated" });
});

const deleteReview = asyncHandler(async (req, res) => {
  const { user_id, album_id } = req.body;

  if (!user_id || !album_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const review = await Review.findOne({ user_id, album_id }).exec();

  if (!review) {
    return res.status(400).json({ message: "Review not found" });
  }

  const result = await review.deleteOne();

  const reply = `User ${result.user_id}, album ${result.album_id} review deleted`;

  res.json(reply);
});

module.exports = {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
};
