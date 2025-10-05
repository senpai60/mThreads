/**
 * Mongoose Schema for a Reply to a Thread
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
    // The thread this reply belongs to
    thread: {
        type: Schema.Types.ObjectId,
        ref: 'Thread',
        required: true,
        index: true,
    },

    // Link to the author
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },

    // Content
    content: {
        type: String,
        required: true,
        maxLength: 500,
    },

    // If this is a reply to another reply (nested), optional
    parentReply: {
        type: Schema.Types.ObjectId,
        ref: 'Reply',
        default: null,
    },

    // Interaction Metrics (kept small; consider separate collection for scale)
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],

    isDeleted: {
        type: Boolean,
        default: false,
    },

}, {
    timestamps: true,
});

module.exports = mongoose.model('Reply', ReplySchema);
