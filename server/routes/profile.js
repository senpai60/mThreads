var express = require("express");
var router = express.Router();
const Profile = require("../models/Profile");
const authenticateToken = require("../middleware/auth");
// Assuming this exports the configured multer instance (e.g., const upload = multer(...)).
// Note: Changed the name to 'uploadMiddleware' to avoid confusion with the method name.
const uploadMiddleware = require("../middleware/upload"); 

// --- 1. GET LOGGED-IN USER'S PROFILE (SECURE) ---
// Route: GET /profile/me
router.get("/me", authenticateToken, async (req, res) => {
  // req.user.id is populated by the authenticateToken middleware (the User ID)
  const userId = req.user.id;
  try {
    // Find the Profile document linked to the User ID
    const profile = await Profile.findOne({ user: userId });

    if (!profile) {
      console.warn(`Profile not found for authenticated user ID: ${userId}`);
      return res.status(404).json({ msg: "User profile not found." });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching own profile:", error);
    res.status(500).json({ msg: "Server error fetching profile data." });
  }
});


// --- 2. UPDATE LOGGED-IN USER'S PROFILE (SECURE, MULTIPART) ---
// Route: PUT /profile/me (More RESTful than /update POST)
router.put("/me", authenticateToken, uploadMiddleware.single("dp"), async (req, res) => {
  const userId = req.user.id;
  if (!userId) return res.status(400).json({ message: "User not valid" });

  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Update fields if they exist in request body
    const { fullname, bio } = req.body;
    if (fullname) profile.fullname = fullname;
    if (bio) profile.bio = bio;

    // Update profile picture if a file was uploaded
    // Assuming Multer saves files in 'public/uploads'
    if (req.file) {
      profile.profilePictureUrl = `/uploads/${req.file.filename}`;
    }

    await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      profile: {
        fullname: profile.fullname,
        bio: profile.bio,
        profilePictureUrl: profile.profilePictureUrl,
        followers: profile.followers,
        following: profile.following,
        threadCount: profile.threadCount,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
});
// -------------------------------------------------------------------

// --- 3. GET ANY PUBLIC PROFILE BY PROFILE ID (Public Viewer Route) ---
// Route: GET /profile/:id
router.get("/:id", async (req, res) => {
  const profileId = req.params.id;

  try {
    // Find the Profile document by its unique _id
    const profile = await Profile.findById(profileId);

    if (!profile) {
      return res.status(404).json({ msg: "Profile not found." });
    }

    // TODO: ADD PRIVACY CHECK HERE
    // Example: if (!profile.isPublic && profile.user.toString() !== req.user.id) { ... }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Error fetching public profile:", error);
    // This catch handles invalid ID format errors as well
    res.status(500).json({ msg: "Server error or invalid profile ID format." });
  }
});



module.exports = router;