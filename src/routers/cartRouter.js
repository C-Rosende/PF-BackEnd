// cartRouter.js
const express = require('express');
const CartController = require('../controllers/cartController');
const cartRouter = express.Router();
const { checkRole } = require('../middlewares/authMiddleware');

// Rutas del carrito
cartRouter.get('/', checkRole(['user', 'admin']), CartController.getAllCarts);
cartRouter.post('/', checkRole(['user', 'admin']), CartController.createCart);
cartRouter.get('/:id', checkRole(['user', 'admin']), CartController.getCartById);
cartRouter.put('/:id', checkRole(['user', 'admin']), CartController.updateCart);
cartRouter.delete('/:id', checkRole(['user', 'admin']), CartController.deleteCart);
cartRouter.post('/:cid/purchase', checkRole(['user']), CartController.purchaseCart);

module.exports = cartRouter;