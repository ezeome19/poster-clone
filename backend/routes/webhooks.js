const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');

// Route for Flutterwave webhooks
router.post('/flutterwave', webhookController.flutterwaveWebhook);

module.exports = router;
