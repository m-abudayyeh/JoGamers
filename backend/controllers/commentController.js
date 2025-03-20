const Comment = require("../Models/Comment");
const News = require("../Models/news");

const addComment = async (req, res) => {
    const { articleId, content } = req.body;
    const userId = req.userId; 
    try {
        const article = await News.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: "Article not found" });
        }

        if (!article.comments) {
            article.comments = [];  
        }

        const newComment = new Comment({
            content,
            createdBy: userId,
            article: articleId,
        });

        await newComment.save();
        article.comments.push(newComment._id); 
        await article.save();
        console.log(req.body);
        res.status(201).json({ comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error occurred while adding comment' });
    }
};

const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.createdBy.toString() !== req.userId) {
        return res.status(403).json({ message: "You cannot delete someone else's comment" });
    }

    comment.isDeleted = true;

    try {
        await comment.save();
        return res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error while deleting comment:", error); 
        return res.status(500).json({ message: "Error occurred while deleting comment", error: error.message }); 
    }
};

const getComments = async (req, res) => {
    const { articleId } = req.params;

    const article = await News.findById(articleId);
    if (!article) {
        return res.status(404).json({ message: "Article not found" });
    }

    try {
        const comments = await Comment.find({ article: articleId, isDeleted: false })
            .populate("createdBy", "username") 
            .exec();

        return res.status(200).json({ comments });
    } catch (error) {
        return res.status(500).json({ message: "Error occurred while fetching comments", error });
    }
};

const reportComment = async (req, res) => {
    const { commentId } = req.params;
    const { reason } = req.body;

    if (!req.userId) {
        return res.status(401).json({ message: "You must be logged in to report a comment" });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
    }
    console.log("User ID:", req.userId);
    console.log("Comment ID:", commentId);
    console.log("Comment Reports:", comment.reports);

    const hasReported = comment.reports.some(report => report.userId.toString() === req.userId);
    if (hasReported) {
        return res.status(400).json({ message: "You have already reported this comment" });
    }

    comment.reports.push({ userId: req.userId, reason });

    try {
        await comment.save();
        return res.status(200).json({ message: "Comment reported successfully" });
    } catch (error) {
        console.error("Error saving comment:", error);
        return res.status(500).json({ message: "Error occurred while reporting comment", error });
    }
};

module.exports = { addComment, deleteComment, getComments, reportComment };