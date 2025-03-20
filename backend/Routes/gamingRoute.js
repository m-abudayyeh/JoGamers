const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/top-played', async (req, res) => {
  try {
    const response = await axios.get("https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch data from Steam Charts API' });
  }
});

module.exports = router;
