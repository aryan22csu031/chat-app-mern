const mongoose = require("mongoose");

const connect_db = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("mongodb failed to connect, error:", err);
  }
};

module.exports = connect_db;
