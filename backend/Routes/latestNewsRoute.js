const express = require("express");
const router = express.Router();

const latestNewsController = require("../controllers/latestNewsController");





router.get("/latest", latestNewsController.getLatestArticles);
module.exports = router;
