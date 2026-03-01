const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    const db = process.env.MONGO_URI || 'mongodb://localhost/poster-clone';
    mongoose.connect(db)
        .then(() => winston.info(`Connected to ${db}...`));
};
