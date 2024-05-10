// cartRouter.js
const express = require('express');
const CartManagerDB = require('../dao/cartManagerDB');
const ProductManagerDB = require('../dao/productManagerDB');

// Clase para manejar las rutas del carrito
class CartRouter extends express.Router {
    constructor(io) {
        super();
        const cartManager = new CartManagerDB(io);
        const productManager = new ProductManagerDB(io);

        // Ruta para crear un nuevo carrito
        this.post('/', async (req, res) => {
            await cartManager.addCart();
            res.status(201).json({ message: 'Carrito creado exitosamente' });
        });

        // Ruta para obtener un carrito por su ID
        this.get('/:cid', async (req, res) => {
            const id = req.params.cid;
            try {
                const cart = await cartManager.getCartById(id);
                res.json(cart);
            } catch (error) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        });

        // Ruta para agregar un producto a un carrito
        this.post('/:cid/products/:pid', async (req, res) => {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            try {
                await cartManager.addProductToCart(cartId, productId);
                res.json({ message: 'Producto agregado al carrito exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
        });

        // Ruta para eliminar un producto de un carrito
        this.delete('/:cid/products/:pid', async (req, res) => {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            try {
                await cartManager.deleteProductFromCart(cartId, productId);
                res.json({ message: 'Producto eliminado del carrito exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
        });

        // Ruta para actualizar un carrito con una nueva lista de productos
        this.put('/:cid', async (req, res) => {
            const cartId = req.params.cid;
            const products = req.body.products;
            try {
                const cart = await cartManager.getCartById(cartId);
                cart.products = products.map(product => ({
                    id: product.id,
                    quantity: product.quantity
                }));
                await cart.save();
                res.json({ message: 'Carrito actualizado exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        });

        // Ruta para actualizar la cantidad de un producto en un carrito
        this.put('/:cid/products/:pid', async (req, res) => {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;
            try {
                const cart = await cartManager.getCartById(cartId);
                const product = cart.products.find(product => product.id === productId);
                if (!product) {
                    throw new Error('Producto no encontrado en el carrito');
                }
                product.quantity = quantity;
                await cart.save();
                res.json({ message: 'Cantidad de producto actualizada exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
        });

        // Ruta para eliminar todos los productos de un carrito
        this.delete('/:cid', async (req, res) => {
            const cartId = req.params.cid;
            try {
                const cart = await cartManager.getCartById(cartId);
                cart.products = [];
                await cart.save();
                res.json({ message: 'Todos los productos eliminados del carrito exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        });
    }
}

module.exports = CartRouter;
