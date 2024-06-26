//cartController.js
const Cart = require('../dao/models/cart');
const Product = require('../dao/models/product');
const Ticket = require('../dao/models/ticket');
const { v4: uuidv4 } = require('uuid');

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

exports.purchaseCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const purchasedProducts = [];
        const notPurchasedProducts = [];

        for (let item of cart.products) {
            const product = item.product;
            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                purchasedProducts.push(item);
            } else {
                notPurchasedProducts.push(item);
            }
        }

        const totalAmount = purchasedProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        const ticket = new Ticket({
            code: uuidv4(),
            amount: totalAmount,
            purchaser: req.user.email
        });

        await ticket.save();

        cart.products = notPurchasedProducts;
        await cart.save();

        res.json({ ticket, notPurchasedProducts });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};