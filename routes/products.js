const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, admin } = require('../middleware/auth');

// Get all products with filters
router.get('/', async (req, res) => {
    try {
        const { brand, ram, storage, network, minPrice, maxPrice, sort } = req.query;
        let query = {};

        if (brand) query.brand = brand;
        if (ram) query['specs.ram'] = ram;
        if (storage) query['specs.storage'] = storage;
        if (network) query['specs.network'] = network;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOrder = {};
        if (sort === 'price_low') sortOrder.price = 1;
        else if (sort === 'price_high') sortOrder.price = -1;
        else sortOrder.createdAt = -1;

        const products = await Product.find(query).sort(sortOrder);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Add Product (Admin Only)
router.post('/', auth, admin, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// Update Product
router.put('/:id', auth, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete Product
router.delete('/:id', auth, admin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
