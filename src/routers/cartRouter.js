// cartRouter.js
const express = require('express');
const CartController = require('../controllers/cartController');
const cartRouter = express.Router();

cartRouter.get('/', CartController.getAllCarts);
cartRouter.post('/', CartController.createCart);
cartRouter.get('/:id', CartController.getCartById);
cartRouter.put('/:id', CartController.updateCart);
cartRouter.delete('/:id', CartController.deleteCart);

module.exports = cartRouter;