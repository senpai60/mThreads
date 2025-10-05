/**
 * Mongoose Schema for the Thread (Post) Model
 * Represents a primary post or "Thread" initiated by a user.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema({
    // Link to the author
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true, // Indexing for efficient timeline lookups
    },

    // Content
    content: {
        type: String,
        required: true,
        maxLength: 500, // Threads has a limit, often longer than Twitter/X
    },
    mediaUrls: [{
        type: String, // Array of image/video URLs
        default: [],
    }],

    // Interaction Metrics
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users who liked the thread
    }],
    reposts: [{
        type: Schema.Types.ObjectId,
        ref: 'User', // Users who reposted the thread
    }],
    quotes: [{
        type: Schema.Types.ObjectId,
        ref: 'Thread', // References other threads that quote this one
    }],
    
    // Reply count (cached count is essential for performance)
    replyCount: {
        type: Number,
        default: 0,
    },

    // Visibility and State
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isSensitive: {
        type: Boolean,
        default: false,
    },
    
    // Original thread if this is a repost or quote, otherwise null
    parentThread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread',
        default: null,
    },
    
}, {
    timestamps: true, // createdAt and updatedAt
});

module.exports = mongoose.model('Thread', ThreadSchema);
