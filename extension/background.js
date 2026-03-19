/**
 * PosterClone Image Importer — Background Service Worker
 * Receives image URLs from content.js and opens the app
 * with the URL as a query parameter.
 */

const POSTER_CLONE_URL = 'https://poster-clone.onrender.com'; // Change to your deployed URL in production

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'OPEN_IN_POSTERCLONE' && message.imageUrl) {
        const targetUrl = `${POSTER_CLONE_URL}/external?url=${encodeURIComponent(message.imageUrl)}`;
        chrome.tabs.create({ url: targetUrl });
        // Respond safely — ignore back/forward cache port errors
        try { sendResponse({ success: true }); } catch (e) {}
    }
    return true; // Keep message channel open for async response
});
