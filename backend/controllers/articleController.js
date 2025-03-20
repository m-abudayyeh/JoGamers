const cloudinary = require("cloudinary").v2;
const News = require('../Models/news');
const Publisher = require("../Models/Publisher");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create News
exports.createArticle = async (req, res) => {
  try {
    const { title, excerpt, platform, category, readTime, content, featured } = req.body;
    const images = [];

    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path);
        images.push(result.secure_url);
      }
    }

    // Use the current logged‑in user (set by your auth middleware)
    const authorId = req.userId;
    if (!authorId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newNews = new News({
      title,
      excerpt,
      platform,
      category,
      readTime,
      content,
      featured: featured === "true" || featured === true,
      images,
      author: authorId,
      approve: false,
    });

    await newNews.save();
    res.status(201).json({ message: "News created successfully", news: newNews });
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({ message: "Error creating news", error: err.message });
  }
};

// Get all news (for dashboard)
exports.getAllArticle = async (req, res) => {
  try {
    const newsList = await News.find()
      .sort({ createdAt: -1 })
      .populate("author", "name")
      .exec();
    res.status(200).json({ news: newsList });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ message: "Error fetching news", error: err.message });
  }
};

// Get news by ID
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    const newsItem = await News.findById(id)
      .populate("author", "name")
      .exec();
    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ news: newsItem });
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ message: "Error fetching news", error: err.message });
  }
};

// Update news
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, platform, category, readTime, content, featured } = req.body;
    const updatedData = { title, excerpt, platform, category, readTime, content, featured };

    // If new images are uploaded, update the images array.
    if (req.files && req.files.length > 0) {
      const images = [];
      for (let i = 0; i < req.files.length; i++) {
        const result = await cloudinary.uploader.upload(req.files[i].path);
        images.push(result.secure_url);
      }
      updatedData.images = images;
    }

    const updatedNews = await News.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News updated successfully", news: updatedNews });
  } catch (err) {
    console.error("Error updating news:", err);
    res.status(500).json({ message: "Error updating news", error: err.message });
  }
};

// Delete news
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedNews = await News.findByIdAndDelete(id);
    if (!deletedNews) {
      return res.status(404).json({ message: "News not found" });
    }
    res.status(200).json({ message: "News deleted successfully" });
  } catch (err) {
    console.error("Error deleting news:", err);
    res.status(500).json({ message: "Error deleting news", error: err.message });
  }
};

// Approve news
exports.approveArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const newsItem = await News.findById(id);
    if (!newsItem) {
      return res.status(404).json({ message: "News not found" });
    }
    newsItem.approve = true;
    await newsItem.save();
    res.status(200).json({ message: "News approved successfully", news: newsItem });
  } catch (err) {
    console.error("Error approving news:", err);
    res.status(500).json({ message: "Error approving news", error: err.message });
  }
};
