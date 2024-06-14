//productController.js
const Product = require('../dao/models/product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send('Error obteniendo productos');
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).send('Error obteniendo el producto');
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).send('Error creando el producto');
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send('Producto no encontrado');
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).send('Error actualizando el producto');
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).send('Producto no encontrado');
        }
        res.status(200).send('Producto eliminado');
    } catch (error) {
        res.status(500).send('Error eliminando el producto');
    }
};