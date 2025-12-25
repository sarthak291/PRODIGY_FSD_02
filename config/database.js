console.log("database.js loaded");

const mongoose = require("mongoose");

function connectDB() {
  console.log("connectDB function executed");

  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => {
      console.error("MongoDB error:", err.message);
      process.exit(1);
    });
}

module.exports = connectDB;
