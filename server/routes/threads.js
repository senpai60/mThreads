const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const Thread = require("../models/Thread");
const upload = require("../middleware/upload");

// FIX: Nested Population structure to fetch DP from Profile schema (via User model)
const authorPopulation = {
  path: "author",
  select: "username profile", // User model se username aur Profile ID select ki
  populate: {
    path: "profile", // Nested: Profile document ko populate kiya
    select: "fullname profilePictureUrl", // Profile se DP aur fullname uthaya
  },
};

router.get("/mythreads", authMiddleware, async (req, res) => {
  const author = req.user.id;

  try {
    const myThreads = await Thread.find({ author })
      .sort({ createdAt: -1 })
      .populate(authorPopulation) // FIX APPLIED
      .populate({
        path: "quotes",
        select: "content author createdAt",
        populate: authorPopulation, // Quotes ke author ke liye bhi yahi population use kiya
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

      // FIX: Use the Nested Population for the response thread as well
      await newThread.populate(authorPopulation);

      return res.status(201).json({ thread: newThread });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error creating thread" });
    }
  }
);

router.post("/like", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { threadId } = req.body; // ✅ this must match frontend body

    if (!threadId) {
      return res.status(400).json({ message: "Thread ID required" });
    }

    // ✅ find by plain string
    const thread = await Thread.findById(threadId);
    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    const alreadyLiked = thread.likes.includes(userId);

    if (alreadyLiked) {
      thread.likes.pull(userId);
    } else {
      thread.likes.push(userId);
    }

    await thread.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likeCount: thread.likes.length,
    });
  } catch (error) {
    console.error("Error liking thread:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
