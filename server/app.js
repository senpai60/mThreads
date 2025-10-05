var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// Router and Config
var indexRouter = require("./routes/index");
const mongoose = require("mongoose");
require("dotenv").config();

// --- MongoDB Connection Check and Setup ---
const DB_URI = process.env.MONGO_URI;

// A critical check to ensure the MongoDB URI is present and not the placeholder
if (!DB_URI || DB_URI.includes('<db-username>')) {
    console.error("FATAL ERROR: MONGO_URI is missing or using a placeholder value. Please check and update your .env file!");
    // Exit gracefully if the app can't connect to the database
    process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(DB_URI, {
    // Note: useNewUrlParser and useUnifiedTopology are often implied/deprecated 
    // in newer Mongoose versions, but keeping them won't hurt.
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    // We already handled the missing URI error above, but this catches connection issues.
    console.error("Failed to connect to MongoDB", err);
    // You might choose to still exit here on severe connection failure
    process.exit(1);
  });

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Route setup (assuming /mthreads is where your index/auth routes live)
app.use("/mthreads", indexRouter);

// Start Server
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});

module.exports = app;
