const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  platform: {
    type: String,
    required: true,
    enum: ["PC", "PS4", "PS5", "Xbox", "Nintendo Switch", "other"], 
  },
  category: {
    type: String,
    required: true,
    enum: ["FPS", "RPG", "Adventure", "Strategy", "Sports", "Hardware", "Indie", "Mobile", "Other"]
  },
  images: { type: [String], required: true },
  readTime: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true,
  },
  content: { type: String, required: true },
  approve: { type: Boolean, default: false },
}, { timestamps: true });

const News = mongoose.model("News", newsSchema);
console.log("🚀 News model loaded:", News); 
module.exports = News;