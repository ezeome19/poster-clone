const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper for SiliconFlow LLM (Prompt Expansion & Interview Questions)
async function siliconFlowChat(messages, model = 'Qwen/Qwen2.5-72B-Instruct') {
    const rawKey = process.env.SILICONFLOW_API_KEY?.trim();
    if (!rawKey) throw new Error('SILICONFLOW_API_KEY is missing');

    const domains = ['api.siliconflow.cn', 'api.siliconflow.com'];
    let lastError = null;

    for (const domain of domains) {
        try {
            console.log(`Attempting SiliconFlow request via ${domain}...`);
            const response = await axios.post(`https://${domain}/v1/chat/completions`, {
                model,
                messages,
                temperature: 0.7,
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${rawKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        } catch (error) {
            lastError = error;
            const status = error.response?.status;
            const errorData = error.response?.data;

            console.error(`SiliconFlow Error (${domain}):`, JSON.stringify(errorData || error.message, null, 2));

            // If it's not a 401/403 (auth error), don't bother trying the other domain if it's a 4xx client error
            // But if it's a 401, the key might be for the other region.
            if (status !== 401 && status !== 403) break;
        }
    }

    const finalErrorMsg = lastError.response?.data?.message || lastError.response?.data?.error?.message || lastError.message;
    throw new Error(`SiliconFlow AI Error: ${finalErrorMsg}`);
}

// Whispr Flow: Expands basic prompt
router.post('/whispr-flow', async (req, res) => {
    const { prompt } = req.body;

    try {
        const systemPrompt = "You are a professional prompt engineer for AI image generators. Your task is to expand the user's simple idea into a high-detail, artistic prompt. Focus on lighting, texture, style, and composition. Keep the output as a single descriptive paragraph.";
        const expandedPrompt = await siliconFlowChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: `Expand this prompt: ${prompt}` }
        ]);
        res.send({ expandedPrompt });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Interview Agent: Asks clarifying questions
router.post('/interview-agent', async (req, res) => {
    const { expandedPrompt } = req.body;

    try {
        const systemPrompt = "Based on the following image prompt, generate 3 concise questions to ask the user to refine the style, mood, or details. Output ONLY a JSON array of strings.";
        const responseJson = await siliconFlowChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: expandedPrompt }
        ]);

        // Clean and parse JSON from LLM response
        const questions = JSON.parse(responseJson.replace(/```json|```/g, '').trim());
        res.send({ questions });
    } catch (error) {
        console.error('Interview Agent Error:', error.message);
        // Fallback questions if AI fails
        res.send({
            questions: [
                "What color palette would you prefer?",
                "Should this be realistic or abstract?",
                "Is there a specific emotional tone?"
            ]
        });
    }
});

// Generate Image: Multi-provider support
router.post('/generate', async (req, res) => {
    const { prompt, answers, provider = 'siliconflow' } = req.body;

    // Combine prompt with interview answers
    const finalPrompt = answers && answers.length > 0
        ? `${prompt}. Additional details: ${answers.join(', ')}`
        : prompt;

    try {
        let imageUrl = '';

        if (provider === 'siliconflow') {
            const rawKey = process.env.SILICONFLOW_API_KEY?.trim();
            if (!rawKey) throw new Error('SILICONFLOW_API_KEY is missing');

            const domains = ['api.siliconflow.cn', 'api.siliconflow.com'];
            let lastError = null;

            for (const domain of domains) {
                try {
                    console.log(`Attempting SiliconFlow Generation via ${domain}...`);
                    const response = await axios.post(`https://${domain}/v1/images/generations`, {
                        model: 'black-forest-labs/FLUX.1-schnell',
                        prompt: finalPrompt,
                        image_size: '1024x1024',
                        batch_size: 1
                    }, {
                        headers: {
                            'Authorization': `Bearer ${rawKey}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    imageUrl = response.data.images[0].url;
                    break; // Success!
                } catch (error) {
                    lastError = error;
                    if (error.response?.status !== 401 && error.response?.status !== 403) break;
                }
            }

            if (!imageUrl && lastError) {
                const errorMsg = lastError.response?.data?.message || lastError.response?.data?.error?.message || lastError.message;
                throw new Error(`SiliconFlow Generation Error: ${errorMsg}`);
            }
        }
        else if (provider === 'shutterstock') {
            const response = await axios.post('https://api.shutterstock.com/v2/ai/images/generations', {
                prompt: finalPrompt,
                num_images: 1
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.SHUTTERSTOCK_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
            // Shutterstock returns an ID, then we might need to poll or it returns data directly depending on API version
            // For v2/ai/images/generations it usually returns the list of images
            imageUrl = response.data.data[0].url;
        }

        res.send({
            id: Date.now(),
            status: 'completed',
            imageUrl,
            finalPrompt,
            provider
        });

    } catch (error) {
        console.error('Generation Error:', error.response?.data || error.message);
        res.status(500).send({
            error: 'Failed to generate image',
            details: error.response?.data || error.message
        });
    }
});

module.exports = router;
