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

// Validate External Image URL (no storage — just probe the URL)
router.post('/validate-url', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).send({ error: 'URL is required' });

        // Validate URL format
        let parsedUrl;
        try {
            parsedUrl = new URL(url);
        } catch {
            return res.status(400).send({ error: 'Invalid URL format' });
        }

        // Only allow http/https
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return res.status(400).send({ error: 'Only HTTP/HTTPS URLs are allowed' });
        }

        // Probe the URL with a HEAD request to verify it's an image
        const response = await axios.head(url, {
            timeout: 8000,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PosterClone/1.0)' }
        });

        const contentType = response.headers['content-type'] || '';
        if (!contentType.startsWith('image/')) {
            return res.status(422).send({
                error: `That URL points to a ${contentType.split(';')[0] || 'webpage'}, not an image. You need to right-click the image on the site and choose "Copy image address", then paste that direct image link here.`
            });
        }

        res.send({
            valid: true,
            url,
            contentType,
            source: parsedUrl.hostname
        });
    } catch (error) {
        const status = error.response?.status;
        if (status === 403 || status === 401) {
            // Some CDNs block HEAD requests — still likely a valid image
            return res.send({ valid: true, url, contentType: 'image/unknown', source: '' });
        }
        res.status(500).send({ error: 'Could not reach the image URL. It may be private or unavailable.' });
    }
});

// Proxy External Image (to bypass CORS for cropper/previews)
router.get('/proxy', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) return res.status(400).send({ error: 'URL is required' });

        const response = await axios.get(url, {
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PosterClone/1.0)' },
            timeout: 15000
        });

        // Forward content-type and stream the image back
        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        res.status(500).send({ error: 'Failed to proxy image' });
    }
});

module.exports = router;
