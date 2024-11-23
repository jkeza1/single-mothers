// controllers/authController.js
const User = require('../models/user'); // Import the User model

// Login function
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists with the provided username and password
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    }

    // If user exists, return success
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};
// Register function
exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        error: "Username is already taken",
      });
    }

    // Create new user
    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};