const cors = require('cors');

module.exports = function (app) {
    app.use(cors({
        origin: '*', // Allow all origins
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        exposedHeaders: ['Access-Control-Allow-Private-Network'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
    }));

    // Explicitly handle Private Network Access preflights
    app.use((req, res, next) => {
        if (req.headers['access-control-request-private-network']) {
            res.setHeader('Access-Control-Allow-Private-Network', 'true');
        }
        next();
    });
};
