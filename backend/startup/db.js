const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    const db = process.env.MONGO_URI || 'mongodb://localhost/poster-clone';

    // Diagnostic logging (masks password)
    const maskedDb = db.includes('@')
        ? db.replace(/\/\/.*:.*@/, '//****:****@')
        : db;

    winston.info(`Attempting to connect to: ${maskedDb}`);

    mongoose.connect(db)
        .then(() => winston.info(`Connected to MongoDB successfully.`))
        .catch(err => winston.error(`Could not connect to MongoDB: ${err.message}`));
};
