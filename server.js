require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");

// ✅ CREATE app FIRST
const app = express();

// connect database
connectDB();

// middleware
app.use(express.json());

// serve frontend (static files)
app.use(express.static("public"));

// routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employees", require("./routes/employeeRoutes"));

// default route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
