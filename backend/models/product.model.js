const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: String, enum: ['Poster', 'Calendar', 'Frame', 'Custom', 'AI-Generated', 'E-Poster', 'E-Card', 'E-Calendar', 'E-Flyer', 'E-Menu'], required: true },
    images: [String],
    stock: { type: Number, default: 0 },
    dimensions: {
        width: Number,
        height: Number,
        unit: { type: String, default: 'inches' }
    },
    isAIGenerated: { type: Boolean, default: false },
    prompt: String, // If AI generated
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
