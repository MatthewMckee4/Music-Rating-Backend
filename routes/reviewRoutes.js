const express = require("express");
const router = express.Router();
const userController = require("../controllers/reviewController");

router
  .route("/")
  .get(userController.getReviews)
  .post(userController.createReview)
  .patch(userController.updateReview)
  .delete(userController.deleteReview);

module.exports = router;
