/**
 * PosterClone Image Importer — Content Script
 * Runs on: pinterest.com and cosmos.so
 *
 * Watches for clicks on images, extracts the highest-resolution
 * URL available, then sends it to the background script to open
 * the PosterClone app.
 */

const POSTER_CLONE_URL = 'https://poster-clone.onrender.com'; // Change to your deployed URL in production

// ─── Pinterest image URL helpers ─────────────────────────────────────────────
function getPinterestHighRes(src) {
    if (!src) return null;
    // Pinterest serves images like: /236x/, /474x/, /736x/, /originals/
    // We replace the size segment with /originals/ for the best quality
    return src
        .replace(/\/\d+x\//g, '/originals/')
        .replace(/\/\d+x\d+\//g, '/originals/');
}

// ─── Cosmos.so image URL helpers ──────────────────────────────────────────────
function getCosmosHighRes(src) {
    if (!src) return null;
    // Cosmos uses Cloudflare Images with size transforms like /width=400/
    // Remove the transform to get the original
    return src.replace(/\/width=\d+\//, '/').replace(/\?.*$/, '');
}

// ─── Find image URL from a clicked element ────────────────────────────────────
function extractImageUrl(target) {
    const hostname = window.location.hostname;

    // Walk up the DOM tree from the click target to find an image
    let el = target;
    for (let i = 0; i < 8; i++) {
        if (!el) break;

        // Direct <img> element
        if (el.tagName === 'IMG' && el.src && !el.src.endsWith('.svg')) {
            const src = el.src;
            if (hostname.includes('pinterest')) return getPinterestHighRes(src);
            if (hostname.includes('cosmos')) return getCosmosHighRes(src);
            return src;
        }

        // CSS background-image
        const bg = window.getComputedStyle(el).backgroundImage;
        if (bg && bg !== 'none') {
            const match = bg.match(/url\(["']?([^"')]+)["']?\)/);
            if (match && match[1] && !match[1].endsWith('.svg')) {
                if (hostname.includes('pinterest')) return getPinterestHighRes(match[1]);
                if (hostname.includes('cosmos')) return getCosmosHighRes(match[1]);
                return match[1];
            }
        }

        el = el.parentElement;
    }
    return null;
}

// ─── Inject click overlay ─────────────────────────────────────────────────────
let overlay = null;

function showOverlay(x, y, imageUrl) {
    removeOverlay();

    overlay = document.createElement('div');
    overlay.id = 'posterclone-overlay';
    overlay.innerHTML = `
        <style>
            #posterclone-overlay {
                position: fixed;
                z-index: 2147483647;
                top: ${Math.min(y + 12, window.innerHeight - 80)}px;
                left: ${Math.min(x + 12, window.innerWidth - 220)}px;
                background: #000;
                color: #fff;
                font-family: -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                padding: 10px 16px;
                border-radius: 100px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: background 0.2s;
                white-space: nowrap;
                animation: pcFadeIn 0.2s ease;
            }
            #posterclone-overlay:hover { background: #2563EB; }
            @keyframes pcFadeIn {
                from { opacity: 0; transform: scale(0.9); }
                to   { opacity: 1; transform: scale(1); }
            }
        </style>
        🖼️ Make a Product
    `;

    overlay.addEventListener('click', (e) => {
        e.stopPropagation();
        removeOverlay();
        try {
            // Try to open via background script
            chrome.runtime.sendMessage({ type: 'OPEN_IN_POSTERCLONE', imageUrl }, () => {
                void chrome.runtime.lastError; // Suppress unchecked error warning
            });
        } catch (err) {
            // Extension context was invalidated (e.g. after reload) — open directly
            const targetUrl = `${POSTER_CLONE_URL}/external?url=${encodeURIComponent(imageUrl)}`;
            window.open(targetUrl, '_blank', 'noopener,noreferrer');
        }
    });

    document.body.appendChild(overlay);

    // Auto-dismiss after 4 seconds
    setTimeout(removeOverlay, 4000);
}

function removeOverlay() {
    if (overlay) {
        overlay.remove();
        overlay = null;
    }
}

// ─── Main click listener ──────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
    const imageUrl = extractImageUrl(e.target);
    if (imageUrl) {
        e.preventDefault();
        e.stopPropagation();
        showOverlay(e.clientX, e.clientY, imageUrl);
    } else {
        removeOverlay();
    }
}, true); // Use capture phase

// Dismiss overlay on scroll or Escape key
document.addEventListener('scroll', removeOverlay, { passive: true });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') removeOverlay(); });
