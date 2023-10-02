const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router
  .route("/")
  .get(reviewController.getReviews)
  .post(reviewController.createReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
