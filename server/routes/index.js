var express = require("express");
var router = express.Router();

// Require the routes modules
const userRoute = require("./users");
const profileRoute = require("./profile");
const threadsRoute = require("./threads")

// Middleware to use the routes
//router.use('/settings', settingsRoute); // Uncomment when settings routes are implemented

// get routes
router.get("/", function (req, res) {
  res.render("index", { title: "Express" });
});

router.use("/profile", profileRoute);
router.use("/users", userRoute);
router.use("/threads",threadsRoute)

module.exports = router;
