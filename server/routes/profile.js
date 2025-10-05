var express = require("express");
var router = express.Router();
const Profile = require('../models/Profile'); // Renamed to singular convention
// NOTE: You must have a middleware file at '../middleware/auth'
const authenticateToken = require('../middleware/auth'); 

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

// --- 2. GET ANY PUBLIC PROFILE BY PROFILE ID (Public Viewer Route) ---
// Route: GET /profile/:id 
// This allows any user to view any other user's profile based on the Profile document ID.
router.get("/:id", async (req, res) => {
    const profileId = req.params.id; 
    
    // Optional: If you want to require authentication to view any profile, re-add 'authenticateToken' here.
    // For a social app, we generally allow public viewing of public profiles.

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
