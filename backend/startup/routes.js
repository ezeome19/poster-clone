const express = require('express');
const products = require('../routes/products');
const orders = require('../routes/orders');
const ai = require('../routes/ai');
const stock = require('../routes/stock');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());
    app.use('/api/products', products);
    app.use('/api/orders', orders);
    app.use('/api/ai', ai);
    app.use('/api/stock', stock);
    app.use(error);
};
