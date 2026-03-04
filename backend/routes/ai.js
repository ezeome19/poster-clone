const express = require('express');
const router = express.Router();

const axios = require('axios');

// Whispr Flow: Expands basic prompt
router.post('/whispr-flow', async (req, res) => {
    const { prompt } = req.body;
    // Mock expansion for now until real API is connected
    const expandedPrompt = `High-resolution, detailed masterpiece: ${prompt}, artistic style, 8k, cinematic lighting, professional composition.`;
    res.send({ expandedPrompt });
});

// Interview Agent: Asks clarifying questions
router.post('/interview-agent', async (req, res) => {
    const { expandedPrompt } = req.body;
    // Generate questions based on prompt depth
    const questions = [
        "What color palette would you prefer for this piece?",
        "Should we lean more towards a realistic or abstract style?",
        "Is there a specific emotional tone you're aiming for?"
    ];
    res.send({ questions });
});

router.post('/generate', async (req, res) => {
    const { prompt, answers } = req.body;
    // Combine prompt with interview answers
    const finalPrompt = answers ? `${prompt}. User Preferences: ${answers.join(', ')}` : prompt;

    let imageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000'; // Default fallback

    try {
        // Try Unsplash first
        const unsplashRes = await axios.get('https://api.unsplash.com/search/photos', {
            params: { query: finalPrompt, per_page: 1 },
            headers: { Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}` }
        });

        if (unsplashRes.data.results && unsplashRes.data.results.length > 0) {
            imageUrl = unsplashRes.data.results[0].urls.regular;
        } else {
            // Fallback to Pexels
            const pexelsRes = await axios.get('https://api.pexels.com/v1/search', {
                params: { query: finalPrompt, per_page: 1 },
                headers: { Authorization: process.env.PEXELS_API_KEY }
            });

            if (pexelsRes.data.photos && pexelsRes.data.photos.length > 0) {
                imageUrl = pexelsRes.data.photos[0].src.large;
            }
        }
    } catch (error) {
        console.error('Error fetching image from stock APIs:', error.message);
        // Keep default imageUrl on error
    }

    res.send({
        id: Date.now(),
        status: 'completed',
        imageUrl,
        finalPrompt
    });
});

module.exports = router;
