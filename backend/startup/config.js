const config = require('config');

module.exports = function () {
    if (!config.get('jwtPrivateKey')) {
        // console.warn('FATAL ERROR: jwtPrivateKey is not defined. Using default for development.');
    }
};
