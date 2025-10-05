/**
 * Mongoose Schema for the Profile Model (Social and Display Data)
 * This schema holds all public profile information and social relationships,
 * decoupled from the core User authentication data.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    // Reference back to the User identity document (Mandatory)
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    // Profile Display Information
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100,
    },
    bio: {
        type: String,
        default: '',
        maxLength: 200,
    },
    profilePictureUrl: {
        type: String,
        default: 'https://placehold.co/150x150/0f172a/ffffff?text=PFP', // Placeholder URL
    },

    // Social Metrics and Relationships (The social graph)
    followers: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users who follow this profile
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users this profile follows
    }],

    // Denormalized/Cached data (optional but good for feeds)
    threadCount: {
        type: Number,
        default: 0,
    },

}, {
    timestamps: true, // createdAt and updatedAt
});

module.exports = mongoose.model('Profile', ProfileSchema);
