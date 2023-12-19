const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.route("/").get(userController.getUsers).post(userController.createUser);

router
  .route("/:spotify_id")
  .get(userController.getUserBySpotifyId)
  .put(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
