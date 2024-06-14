// productRouter.js
const express = require('express');
const ProductController = require('../controllers/productController');
const productRouter = express.Router();

productRouter.get('/', ProductController.getAllProducts);
productRouter.post('/', ProductController.createProduct);
productRouter.get('/:id', ProductController.getProductById);
productRouter.put('/:id', ProductController.updateProduct);
productRouter.delete('/:id', ProductController.deleteProduct);

module.exports = productRouter;