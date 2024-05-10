//cartManagerDB.js
const Cart = require('./models/Cart');

class CartManagerDB {
  // Obtiene todos los carritos de la base de datos
  async getCarts() {
    return await Cart.find();
  }

  // Obtiene un carrito específico por su ID
  async getCartById(id) {
    return await Cart.findById(id);
  }

  // Agrega un nuevo carrito a la base de datos
  async addCart() {
    const cart = new Cart();
    await cart.save();
  }

  // Agrega un producto a un carrito específico
  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    cart.products.push({ id: productId, quantity });
    await cart.save();
  }

  // Elimina un producto de un carrito específico
  async deleteProductFromCart(cartId, productId) {
    const cart = await this.getCartById(cartId);
    const productIndex = cart.products.findIndex(product => product.id === productId);
    cart.products.splice(productIndex, 1);
    await cart.save();
  }

  // Obtiene los productos de un carrito específico
  async getProductsFromCart(cartId) {
    const cart = await this.getCartById(cartId);
    return cart.products;
  }
}

module.exports = CartManagerDB;