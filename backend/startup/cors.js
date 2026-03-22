const cors = require('cors');

module.exports = function (app) {
    // 1. Explicitly handle Private Network Access preflights (Must be first)
    app.use((req, res, next) => {
        if (req.headers['access-control-request-private-network']) {
            res.setHeader('Access-Control-Allow-Private-Network', 'true');
        }
        
        // Handle OPTIONS for PNA if needed
        if (req.method === 'OPTIONS' && req.headers['access-control-request-private-network']) {
            return res.status(204).send();
        }
        next();
    });

    // 2. Standard CORS
    app.use(cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    }));
};
