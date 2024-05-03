// productRouter.js
const express = require('express');
const ProductManagerDB = require('../dao/productmanagerDB');

class ProductRouter extends express.Router {
    constructor(io) {
        super();
        const productManager = new ProductManagerDB(io);

        this.get('/', (req, res) => {
            const limit = req.query.limit;
            if (limit) {
                res.json(productManager.getProducts().slice(0, limit));
            } else {
                res.json(productManager.getProducts());
            }
        });

        this.get('/:pid', (req, res) => {
            const id = Number(req.params.pid);
            try {
                const product = productManager.getProductById(id);
                res.json(product);
            } catch (error) {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });

        this.post('/', (req, res) => {
            const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
            productManager.addProduct(title, description, price, thumbnail, code, stock, category, thumbnails);
            res.status(201).json({ message: 'Producto agregado exitosamente' });
        });

        this.put('/:pid', (req, res) => {
            const id = Number(req.params.pid);
            const newProductData = req.body;
            try {
                productManager.updateProduct(id, newProductData);
                res.json({ message: 'Producto actualizado exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });

        this.delete('/:pid', (req, res) => {
            const id = Number(req.params.pid);
            try {
                productManager.deleteProduct(id);
                res.json({ message: 'Producto eliminado exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });
    }
}

module.exports = ProductRouter;