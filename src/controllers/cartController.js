// cartController.js
const Cart = require('../dao/models/cart');

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCart = async (req, res) => {
    const cart = new Cart(req.body);
    try {
        const newCart = await cart.save();
        res.status(201).json(newCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (cart == null) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (cart == null) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        if (req.body.products != null) {
            cart.products = req.body.products;
        }
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (cart == null) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        await cart.remove();
        res.json({ message: 'Cart deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};