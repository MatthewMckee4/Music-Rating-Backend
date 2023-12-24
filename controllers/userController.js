const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

// Get a single user by Spotify ID
const getUserBySpotifyId = asyncHandler(async (req, res) => {
  const { spotify_id } = req.params;
  const user = await User.findOne({ spotify_id }).lean();

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  const { name, id, image } = req.body;
  if (!name || !id) {
    return res
      .status(400)
      .json({ message: "Username and Spotify ID are required" });
  }

  const duplicate = await User.findOne({ id }).lean();

  if (duplicate) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = await User.create({ name, id, image });
  res.status(201).json(user);
});

const updateUser = asyncHandler(async (req, res) => {
  const { spotify_id } = req.params;
  const { username, profile_pic } = req.body;

  const user = await User.findOneAndUpdate(
    { spotify_id },
    { username, profile_pic },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

const deleteUser = asyncHandler(async (req, res) => {
  const { spotify_id } = req.params;

  const user = await User.findOneAndDelete({ spotify_id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted" });
});

module.exports = {
  getUsers,
  getUserBySpotifyId,
  createUser,
  updateUser,
  deleteUser,
};
