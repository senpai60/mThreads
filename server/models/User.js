/**
 * Mongoose Schema for the User Model (Authentication and Identity only)
 * This schema holds the minimal data required for login and identity.
 * It is decoupled from the social/display data found in the 'Profile' model.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // Core Identity Fields
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String, // Hashed password will be stored here
        required: true,
    },

    // References to related documents (Association Links)
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile', // Links to the Profile document (1:1 but optional during creation)
        default: null,
    },
    settings: {
        type: Schema.Types.ObjectId,
        ref: 'UserSetting', // Links to the UserSetting document
        default: null,
    },

}, {
    timestamps: true, // createdAt and updatedAt
});

module.exports = mongoose.model('User', UserSchema);
