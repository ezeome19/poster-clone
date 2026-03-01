const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
    const products = await Product.find().sort('name');
    res.send(products);
};

exports.getProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found.');
    res.send(product);
};

exports.createProduct = async (req, res) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        images: req.body.images,
        stock: req.body.stock,
        dimensions: req.body.dimensions,
        isAIGenerated: req.body.isAIGenerated,
        prompt: req.body.prompt
    });
    await product.save();
    res.send(product);
};
