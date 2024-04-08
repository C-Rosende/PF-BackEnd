//productRouter.js
const express = require('express');
const ProductManager = require('../managers/productManager');
const router = express.Router();

const productManager = new ProductManager();

// Rutas para manejar los productos
router.get('/', (req, res) => {
    const limit = req.query.limit;
    if (limit) {
        res.json(productManager.getProducts().slice(0, limit));
    } else {
        res.json(productManager.getProducts());
    }
});

router.get('/:pid', (req, res) => {
    const id = Number(req.params.pid);
    try {
        const product = productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.post('/', (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    productManager.addProduct(title, description, price, thumbnail, code, stock, category, thumbnails);
    res.status(201).json({ message: 'Producto agregado exitosamente' });
});

router.put('/:pid', (req, res) => {
    const id = Number(req.params.pid);
    const newProductData = req.body;
    try {
        productManager.updateProduct(id, newProductData);
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.delete('/:pid', (req, res) => {
    const id = Number(req.params.pid);
    try {
        productManager.deleteProduct(id);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

module.exports = router;