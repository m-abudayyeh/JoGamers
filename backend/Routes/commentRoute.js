const express = require("express");
const { addComment, deleteComment, getComments, reportComment } = require("../controllers/commentController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/add", protect, addComment);

router.delete("/delete/:commentId", protect, deleteComment);

router.get("/:articleId", getComments);

router.post("/report/:commentId", protect, reportComment);

module.exports = router;
