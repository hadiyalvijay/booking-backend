const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const dbUrl = process.env.MONGO_URI;

// Debugging: Check if the MONGO_URI is being loaded correctly
if (!dbUrl) {
  console.error("ERROR: MONGO_URI is not defined. Check your .env file.");
  process.exit(1); // Exit the process if no DB URL is found
} else {
  console.log("Connecting to MongoDB:", dbUrl);
}

mongoose.set("strictQuery", false);
const connectToMongo = async () => {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DATABASE CONNECTED SUCCESSFULLY");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1); // Exit process on failure
  }
};

module.exports = connectToMongo;
