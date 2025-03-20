const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');


router.post('/create', newsController.createNews);


router.get('/allNews', newsController.getAllNews);

router.get('/allNewsPagination', newsController.getAllNewsPagination);


router.get('/allNews/:id', newsController.getNewsById);


router.put('/editnews/:id', newsController.updateNews);


router.delete('/news/:id', newsController.deleteNews);

module.exports = router;