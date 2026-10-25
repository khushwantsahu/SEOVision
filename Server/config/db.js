const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI provided in environment variables.
 * Handles connection events and logs status for student/viva debugging.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    // Exit process with failure code if database connection fails
    process.exit(1);
  }
};

module.exports = connectDB;
