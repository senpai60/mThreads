const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const Thread = require("../models/Thread");
const upload = require("../middleware/upload");

const authorPopulation = {
  path: "author",
  select: "username profile", // User model mein sirf username aur profile ki ID select ki
  populate: {
    path: "profile", // Nested: Profile model ko populate kiya
    select: "fullname profilePictureUrl", // Profile se DP aur fullname uthaya
  },
};

router.get("/mythreads", authMiddleware, async (req, res) => {
  const author = req.user.id;

  try {
    const myThreads = await Thread.find({ author })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username fullname profilePictureUrl",
      })
      .populate({
        path: "quotes",
        select: "content author createdAt",
        populate: {
          path: "author",
          select: "username fullname profilePictureUrl",
        },
      });

    return res.status(200).json({ threads: myThreads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const allThreads = await Thread.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .populate(authorPopulation) // FIX APPLIED
      .populate({
        path: "quotes",
        select: "content author createdAt",
        // Quotes ke author ke liye bhi yahi population use kiya
        populate: authorPopulation,
      });

    return res.status(200).json({ threads: allThreads });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/post",
  authMiddleware,
  upload.array("media", 4),
  async (req, res) => {
    const userId = req.user.id;
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    try {
      const mediaUrls = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const newThread = await Thread.create({
        author: userId,
        content: content.trim(),
        mediaUrls,
      });
      await newThread.populate({
        path: "author",
        select: "username fullname profilePictureUrl",
      });
      return res.status(201).json({ thread: newThread });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error creating thread" });
    }
  }
);
module.exports = router;
