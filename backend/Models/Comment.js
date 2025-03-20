const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    article: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
    },
    reports: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, reason: String }],
    
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

