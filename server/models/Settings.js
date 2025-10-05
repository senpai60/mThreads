/**
 * Mongoose Schema for User Settings
 *
 * This schema defines the structure for a user's preferences in a Threads clone.
 * It uses nested objects for logical grouping (Profile, Notifications, Privacy)
 * and sets appropriate default values for common settings.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- Nested Schemas for Clarity (or use direct object definition) ---

// 1. Profile Settings Schema
const ProfileSettingsSchema = new Schema({
    // Determines if the profile is public or private (true = public)
    isPublic: {
        type: Boolean,
        default: true,
        required: true,
    },
    // Display the follower count on the user's profile
    showFollowerCount: {
        type: Boolean,
        default: true,
        required: true,
    },
    // Defines who can interact/reply to the user's threads
    threadInteraction: {
        type: String,
        enum: ['everyone', 'followers', 'no_one'],
        default: 'everyone',
        required: true,
    },
}, { _id: false }); // Do not create a separate ID for the sub-document

// 2. Notification Settings Schema
const NotificationSettingsSchema = new Schema({
    // Master toggle for all push notifications
    pushNotifications: {
        type: Boolean,
        default: true,
        required: true,
    },
    // Notifications for likes and replies on threads
    likesAndReplies: {
        type: Boolean,
        default: true,
        required: true,
    },
    // Notifications for new followers
    newFollowers: {
        type: Boolean,
        default: false,
        required: true,
    },
    // Who the user receives mention notifications from
    mentions: {
        type: String,
        enum: ['from_everyone', 'from_followers', 'off'],
        default: 'from_everyone',
        required: true,
    },
}, { _id: false });

// 3. Privacy and Safety Settings Schema
const PrivacySettingsSchema = new Schema({
    // Array of User IDs (Strings) that the current user has muted
    mutedAccounts: {
        type: [String],
        default: [],
    },
    // Array of User IDs (Strings) that the current user has blocked
    blockedAccounts: {
        type: [String],
        default: [],
    },
    // Option to hide the total number of likes on other users' posts
    hideLikes: {
        type: Boolean,
        default: false,
        required: true,
    },
    // Filter to automatically hide potentially sensitive content
    sensitiveContentFilter: {
        type: Boolean,
        default: true,
        required: true,
    },
}, { _id: false });

// 4. Account Settings Schema (General)
const AccountSettingsSchema = new Schema({
    language: {
        type: String,
        enum: ['en-US', 'es-ES', 'ja-JP', 'fr-FR'], // Add all supported languages
        default: 'en-US',
    },
    darkMode: {
        type: Boolean,
        default: true,
    },
}, { _id: false });


// --- Main User Setting Schema ---
const UserSettingSchema = new Schema({
    // Reference to the main User model (mandatory for linking settings to a user)
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Reference to the main User model
        required: true,
        unique: true, // A user should only have one settings document
    },

    profile: {
        type: ProfileSettingsSchema,
        default: {}, // Initialize with defaults from sub-schema
        required: true,
    },

    notifications: {
        type: NotificationSettingsSchema,
        default: {}, // Initialize with defaults from sub-schema
        required: true,
    },

    privacy: {
        type: PrivacySettingsSchema,
        default: {}, // Initialize with defaults from sub-schema
        required: true,
    },

    account: {
        type: AccountSettingsSchema,
        default: {}, // Initialize with defaults from sub-schema
        required: true,
    },

}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = mongoose.model('UserSetting', UserSettingSchema);
