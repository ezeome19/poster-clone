const express = require('express');
const axios = require('axios');
const router = express.Router();

const PEXELS_URL = 'https://api.pexels.com/v1';
const UNSPLASH_URL = 'https://api.unsplash.com';

// Search Pexels (Images)
router.get('/pexels/images', async (req, res) => {
    try {
        const { query, page = 1, per_page = 15 } = req.query;
        const response = await axios.get(`${PEXELS_URL}/search`, {
            params: { query, page, per_page },
            headers: { Authorization: process.env.PEXELS_API_KEY }
        });
        res.send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

// Search Pexels (Videos)
router.get('/pexels/videos', async (req, res) => {
    try {
        const { query, page = 1, per_page = 15 } = req.query;
        const response = await axios.get(`https://api.pexels.com/videos/search`, {
            params: { query, page, per_page },
            headers: { Authorization: process.env.PEXELS_API_KEY }
        });
        res.send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

// Search Unsplash
router.get('/unsplash', async (req, res) => {
    try {
        const { query, page = 1, per_page = 15 } = req.query;
        const response = await axios.get(`${UNSPLASH_URL}/search/photos`, {
            params: { query, page, per_page },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
        });
        res.send(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

module.exports = router;
