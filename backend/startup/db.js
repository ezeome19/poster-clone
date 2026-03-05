const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports = function () {
    let db = process.env.MONGO_URI || 'mongodb://localhost/poster-clone';

    // Automatically add database name if it's a standard SRV string without one
    if (db.startsWith('mongodb+srv') && !db.includes('/', db.indexOf('.net'))) {
        db = db.replace('.net/', '.net/poster-clone');
        // If there's no trailing slash at all
        if (!db.includes('.net/')) {
            db = db.replace('.net', '.net/poster-clone');
        }
    }

    // Diagnostic logging (masks password)
    const maskedDb = db.includes('@')
        ? db.replace(/\/\/.*:.*@/, '//****:****@')
        : db;

    winston.info(`Attempting to connect to: ${maskedDb}`);

    mongoose.connect(db)
        .then(() => winston.info(`Connected to MongoDB successfully.`))
        .catch(err => winston.error(`Could not connect to MongoDB: ${err.message}`));
};
