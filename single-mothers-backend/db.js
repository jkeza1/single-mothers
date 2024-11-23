const mongoose = require("mongoose");

// Use environment variable for MongoDB URI or fallback to local database
const localDB = `mongodb://localhost:27017/role_auth`;
const mongoURI = process.env.MONGO_URI || localDB;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${mongoURI}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;
