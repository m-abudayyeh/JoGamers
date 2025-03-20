const express = require('express');
const { getArticleStatus , toggleLikeArticle , toggleBookmarkArticle  } = require('../controllers/likeBookmarkController')
const router = express.Router();


const protect = require("../middlewares/authMiddleware");

router.get('/getArticleStatus/:articleId',protect, getArticleStatus);

router.post('/like', protect, toggleLikeArticle);

router.post('/bookmark',protect , toggleBookmarkArticle);

module.exports = router;
