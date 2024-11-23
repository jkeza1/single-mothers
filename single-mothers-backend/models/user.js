// user.js
const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

const User = Mongoose.model("user", UserSchema); // Create the User model
module.exports = User; // Export the User model
