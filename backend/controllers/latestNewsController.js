const Article = require("../Models/news"); // Ensure you have the correct path to your Article model

// Function to fetch the latest 6 articles
exports.getLatestArticles = async (req, res) => {
  try {
    const articles = await Article.find() // Fetch all articles
      .sort({ createdAt: -1 }) // Sort articles by createdAt field in descending order (latest first)
      .limit(6); // Limit to the latest 6 articles

    if (articles.length === 0) {
      return res.status(404).json({ message: "No articles found" });
    }

    res.status(200).json({ articles });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching articles", error: err.message });
  }
};
