const express = require('express');
const path = require('path');
const products = require('../routes/products');
const orders = require('../routes/orders');
const ai = require('../routes/ai');
const stock = require('../routes/stock');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());

    // API routes
    app.use('/api/products', products);
    app.use('/api/orders', orders);
    app.use('/api/ai', ai);
    app.use('/api/stock', stock);

    // Serve built React frontend (production)
    const frontendDist = path.join(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist));

    // Catch-all: send index.html for any non-API route (React Router SPA support)
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendDist, 'index.html'));
    });

    app.use(error);
};

