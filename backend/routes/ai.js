const express = require('express');
const router = express.Router();

router.post('/generate', async (req, res) => {
    // Mock AI generation for now
    const { prompt } = req.body;
    res.send({
        id: Date.now(),
        status: 'completed',
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
        prompt
    });
});

module.exports = router;
