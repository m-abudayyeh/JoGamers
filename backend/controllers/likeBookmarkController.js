const User = require("../Models/User");
const News = require("../Models/news");


const getArticleStatus = async (req, res) => {
  try {
    const userId = req.userId; 
    const { articleId } = req.params; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isLiked = user.likedArticles.includes(articleId);
    const isBookmarked = user.bookmarkedArticles.includes(articleId);

    res.status(200).json({ isLiked, isBookmarked });
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching article status' });
  }
};



const toggleLikeArticle = async (req, res) => {
  try {
    const userId = req.userId; 
    const { articleId } = req.body; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.likedArticles.indexOf(articleId);
    if (index === -1) {
      user.likedArticles.push(articleId); 
    } else {
      user.likedArticles.splice(index, 1); 
    }

    await user.save();
    res.status(200).json({ message: 'Like toggled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while toggling like' });
  }
};



const toggleBookmarkArticle = async (req, res) => {
  try {
    const userId = req.userId; 
    const { articleId } = req.body; 

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const index = user.bookmarkedArticles.indexOf(articleId);
    if (index === -1) {
      user.bookmarkedArticles.push(articleId); 
    } else {
      user.bookmarkedArticles.splice(index, 1); 
    }

    await user.save();
    res.status(200).json({ message: 'Bookmark toggled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while toggling bookmark' });
  }
};

module.exports = { getArticleStatus ,toggleLikeArticle, toggleBookmarkArticle };
