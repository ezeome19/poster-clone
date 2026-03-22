const express = require('express');
const axios = require('axios');
const winston = require('winston');
const router = express.Router();

winston.error('STOCK ROUTES MODULE LOADED');

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

/**
 * Resolves social/sharing URLs (Pinterest, Cosmos, etc) to direct high-res image URLs
 * by scraping the page's metadata if necessary.
 */
async function resolveExternalUrl(inputUrl) {
    winston.info(`Resolving URL: ${inputUrl}`);
    try {
        const parsed = new URL(inputUrl);
        const hostname = parsed.hostname.toLowerCase();

        // 1. Pinterest (Pins and short-links)
        if (hostname.includes('pinterest.') || hostname === 'pin.it') {
            winston.error('Identified as Pinterest URL');
            const response = await axios.get(inputUrl, {
                headers: { 
                    // Use a Bot User-Agent to encourage Pinterest to return meta tags for indexing
                    'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                    'Accept-Language': 'en-US,en;q=0.5'
                },
                timeout: 10000,
                maxRedirects: 10
            });
            const html = response.data;
            winston.error(`Fetched HTML, length: ${html.length}`);
            if (html.length < 2000) {
                console.error(`SHORT HTML CONTENT:\n${html}`);
            }
            
            // Robust regex for og:image, handle different quote styles and spacing
            const ogMatch = html.match(/<meta\s+(?:property|name)=["']og:image["']\s+content=["']([^"']+)["']/i) ||
                          html.match(/<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image["']/i);

            if (ogMatch && ogMatch[1]) {
                let resolved = ogMatch[1];
                winston.error(`Found og:image: ${resolved}`);
                // Optimization: try to get the original high-res version if it's a pinimg link
                if (resolved.includes('i.pinimg.com')) {
                    resolved = resolved.replace(/\/\d+x\//, '/originals/');
                    resolved = resolved.split('?')[0];
                    winston.error(`Optimized pinimg URL: ${resolved}`);
                }
                return resolved;
            } else {
                winston.error('Could not find og:image in HTML. Pinterest might be blocking or redirecting.');
            }
        }

        // 2. Cosmos.so
        if (hostname.includes('cosmos.so')) {
            const response = await axios.get(inputUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PosterClone/1.0)' },
                timeout: 8000
            });
            const ogMatch = response.data.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
            if (ogMatch && ogMatch[1]) return ogMatch[1];
        }

        return inputUrl;
    } catch (error) {
        winston.error(`Error resolving URL ${inputUrl}: ${error.message}`);
        return inputUrl; // Fallback to original on any error
    }
}

// Validate External Image URL (no storage — just probe the URL)
router.post('/validate-url', async (req, res) => {
    try {
        const { url: inputUrl } = req.body;
        winston.info(`VALIDATE-URL REQUEST START: ${inputUrl}`);
        if (!inputUrl) return res.status(400).send({ error: 'URL is required' });

        // Basic sanity check
        try {
            new URL(inputUrl);
        } catch {
            return res.status(400).send({ error: 'Invalid URL format' });
        }

        // Resolve shared links (like Pinterest pins) to direct images
        const url = await resolveExternalUrl(inputUrl);
        winston.info(`Resolved URL result: ${url}`);
        const parsedUrl = new URL(url);

        // Only allow http/https
        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return res.status(400).send({ error: 'Only HTTP/HTTPS URLs are allowed' });
        }

        // Probe the URL with a HEAD request to verify it's an image
        let response;
        try {
            response = await axios.head(url, {
                timeout: 8000,
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PosterClone/1.0)' }
            });
        } catch (headError) {
            winston.warn(`HEAD request failed for ${url}, falling back to success: ${headError.message}`);
            return res.send({
                valid: true,
                url,
                originalUrl: inputUrl,
                contentType: 'image/jpeg', // Assumption
                source: parsedUrl.hostname
            });
        }

        const contentType = response.headers['content-type'] || '';
        if (!contentType.startsWith('image/')) {
            winston.warn(`URL is not an image: ${contentType}`);
            return res.status(422).send({
                error: `That URL points to a ${contentType.split(';')[0] || 'webpage'}, not an image. You need to right-click the image on the site and choose "Copy image address", then paste that direct image link here.`
            });
        }

        res.send({
            valid: true,
            url,
            originalUrl: inputUrl,
            contentType,
            source: parsedUrl.hostname
        });
    } catch (error) {
        winston.error(`Validation error for ${req.body.url}: ${error.message}`);
        res.status(500).send({ error: 'Could not reach the image URL. It may be private or unavailable.' });
    }
});

// Proxy External Image (to bypass CORS for cropper/previews)
router.get('/proxy', async (req, res) => {
    const { url } = req.query;
    try {
        if (!url) return res.status(400).send({ error: 'URL is required' });

        winston.info(`Proxying image: ${url}`);
        const response = await axios.get(url, {
            responseType: 'stream',
            headers: { 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://www.pinterest.com/'
            },
            timeout: 15000
        });

        // Forward content-type and stream the image back
        res.set('Content-Type', response.headers['content-type']);
        response.data.pipe(res);
    } catch (error) {
        winston.error(`Proxy failure for ${url}: ${error.message}`);
        if (error.response) {
            winston.error(`Proxy target returned: ${error.response.status} ${JSON.stringify(error.response.data)}`);
        }
        res.status(500).send({ error: 'Failed to proxy image. The source might be blocking our server.' });
    }
});

module.exports = router;
