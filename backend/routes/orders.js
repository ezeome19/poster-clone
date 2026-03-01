const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.post('/checkout', orderController.checkout);
router.post('/verify', orderController.verifyOrder);

module.exports = router;
