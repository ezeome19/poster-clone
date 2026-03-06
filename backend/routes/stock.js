const express = require('express');
const axios = require('axios');
const router = express.Router();

const PEXELS_URL = 'https://api.pexels.com/v1';
const UNSPLASH_URL = 'https://api.unsplash.com';
const SHUTTERSTOCK_URL = 'https://api.shutterstock.com/v2';

// Search Pexels (Images)
router.get('/pexels/images', async (req, res) => {
    try {
        const { query, page = 1, per_page = 20 } = req.query;
        const response = await axios.get(`${PEXELS_URL}/search`, {
            params: { query, page, per_page },
            headers: { Authorization: process.env.PEXELS_API_KEY }
        });

        // Normalize results
        const results = response.data.photos.map(photo => ({
            id: photo.id,
            url: photo.src.large,
            preview: photo.src.medium,
            // Backward Compatibility
            src: photo.src,
            source: 'pexels',
            creator: photo.photographer,
            creator_url: photo.photographer_url
        }));

        res.send({
            results,
            photos: results, // Alias for legacy frontend
            total_count: response.data.total_results,
            page: parseInt(page),
            per_page: parseInt(per_page)
        });
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

// Search Unsplash
router.get('/unsplash', async (req, res) => {
    try {
        const { query, page = 1, per_page = 20 } = req.query;
        const response = await axios.get(`${UNSPLASH_URL}/search/photos`, {
            params: { query, page, per_page },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
        });

        // Normalize results
        const results = response.data.results.map(photo => ({
            id: photo.id,
            url: photo.urls.regular,
            preview: photo.urls.small,
            // Backward Compatibility
            urls: photo.urls,
            source: 'unsplash',
            creator: photo.user.name,
            creator_url: photo.user.links.html
        }));

        res.send({
            results,
            total: response.data.total, // Alias for legacy frontend
            page: parseInt(page),
            per_page: parseInt(per_page)
        });
    } catch (error) {
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

// Search Shutterstock
router.get('/shutterstock', async (req, res) => {
    try {
        const { query, page = 1, per_page = 20 } = req.query;
        const response = await axios.get(`${SHUTTERSTOCK_URL}/images/search`, {
            params: { query, page, per_page },
            headers: { Authorization: `Bearer ${process.env.SHUTTERSTOCK_TOKEN}` }
        });

        // Normalize results
        const results = response.data.data.map(img => ({
            id: img.id,
            url: img.assets.preview.url, // Usually Shutterstock previews are usable
            preview: img.assets.huge_thumb?.url || img.assets.preview.url,
            source: 'shutterstock',
            creator: img.contributor?.id || 'Shutterstock',
            creator_url: `https://www.shutterstock.com/g/${img.contributor?.id}`
        }));

        res.send({
            results,
            total_count: response.data.total_count,
            page: parseInt(page),
            per_page: parseInt(per_page)
        });
    } catch (error) {
        console.error('Shutterstock Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).send(error.response?.data || error.message);
    }
});

module.exports = router;
