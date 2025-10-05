var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Profile = require("../models/Profile");
const UserSetting = require("../models/Settings");
const { settings } = require("../app");
require("dotenv").config();

// Define cookie options outside the routes for clarity (1 hour in ms)
const cookieOptions = {
  httpOnly: true,
  maxAge: 3600000, // 1 hour
  sameSite: "Lax", // Important for cross-port localhost requests
};

/* GET users listing. */
router.post("/register", async (req, res) => {
  const { username, email, password, fullname } = req.body;
  if (!username || !email || !password || !fullname) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      //lline 21
      return res.status(400).json({ msg: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      //line 25
      username,
      email,
      password: hashedPassword,
      fullname,
    });
    const newProfile = await Profile.create({ user: newUser._id, fullname });
    const newSettings = await UserSetting.create({ user: newUser._id });

    await newUser.save();
    await newProfile.save();
    await newSettings.save();
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, cookieOptions);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        profileId: newProfile._id,
        settingsId: newSettings._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileId: user.profile,
        settingsId: user.settings,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/ping", (req, res) => {
  res.status(200).json({ msg: "pong" });
});

router.post("/logout", (req, res) => {
  console.log("logout");
  
  res.clearCookie("token", { httpOnly: true, sameSite: "Lax" });
  res.status(200).json({ msg: "Logged out successfully" });
});

module.exports = router;
