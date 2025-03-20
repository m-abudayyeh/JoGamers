const News = require('../Models/news');


exports.createNews = async (req, res) => {
  try {
    const news = new News(req.body);
    await news.save();
    res.status(201).json({ message: 'News created successfully!', news });
  } catch (error) {
    res.status(500).json({ message: 'Error creating news', error });
  }
};


exports.getAllNews = async (req, res) => {
  try {
    const news = await News.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

exports.getAllNewsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 2;
    const articlesPerPage = parseInt(req.query.articlesPerPage) || 6;

    const skip = (page - 1) * articlesPerPage;

    const news = await News.find()
      .skip(skip) 
      .limit(articlesPerPage); 

    const totalArticles = await News.countDocuments();

    const totalPages = Math.ceil(totalArticles / articlesPerPage);

    res.status(200).json({
      news,
      totalPages,
      currentPage: page,
      totalArticles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news', error });
  }
};


exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json({ message: 'News updated successfully!', news });
  } catch (error) {
    res.status(500).json({ message: 'Error updating news', error });
  }
};


exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.status(200).json({ message: 'News deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news', error });
  }
};
