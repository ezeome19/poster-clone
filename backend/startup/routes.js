const express = require('express');
const path = require('path');
const fs = require('fs');
const products = require('../routes/products');
const orders = require('../routes/orders');
const ai = require('../routes/ai');
const stock = require('../routes/stock');
const webhooks = require('../routes/webhooks');
const error = require('../middleware/error');

module.exports = function (app) {
    app.use(express.json());

    // API routes
    app.use('/api/products', products);
    app.use('/api/orders', orders);
    app.use('/api/ai', ai);
    app.use('/api/stock', stock);
    app.use('/api/webhooks', webhooks);

    // Serve built React frontend (only in production when dist exists)
    const frontendDist = path.join(__dirname, '../../frontend/dist');
    if (fs.existsSync(frontendDist)) {
        app.use(express.static(frontendDist));

        // Catch-all: send index.html for any non-API route (React Router SPA)
        app.get('*', (req, res) => {
            res.sendFile(path.join(frontendDist, 'index.html'));
        });
    }

    app.use(error);
};

