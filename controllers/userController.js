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

  if (!id) {
    return res.status(400).json({ message: " Spotify ID are required" });
  }

  console.log("Attempting to create user:", name);

  const duplicate = await User.findOne({ id }).lean();

  if (duplicate) {
    console.log("User already exists:", name);
    return res.status(201).json({ message: "User already exists" });
  }

  const user = await User.create({ name, id, image });
  console.log("User created successfully:", user);
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
