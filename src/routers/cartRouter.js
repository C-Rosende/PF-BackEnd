// cartRouter.js
const express = require('express');
const CartManager = require('../dao/cartManagerDB');

class CartRouter extends express.Router {
    constructor(io) {
        super();
        const cartManager = new CartManager(io);

        this.post('/', (req, res) => {
            cartManager.addCart();
            res.status(201).json({ message: 'Carrito creado exitosamente' });
        });

        this.get('/:cid', (req, res) => {
            const id = Number(req.params.cid);
            try {
                const cart = cartManager.getCartById(id);
                res.json(cart);
            } catch (error) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        });

        this.post('/:cid/products/:pid', (req, res) => {
            const cartId = Number(req.params.cid);
            const productId = Number(req.params.pid);
            try {
                cartManager.addProductToCart(cartId, productId);
                res.json({ message: 'Producto agregado al carrito exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Carrito o producto no encontrado' });
            }
        });
    }
}

module.exports = CartRouter;