//cartManager.js
const fs = require('fs');

class CartManager {
    constructor() {
        this.carts = [];
        this.id = 0;
        if (fs.existsSync('carts.json')) {
            const data = fs.readFileSync('carts.json', 'utf-8');
            const carts = JSON.parse(data);
            this.carts = carts;
            this.id = this.carts.length;
        }
    }

    saveCarts() {
        fs.writeFileSync('carts.json', JSON.stringify(this.carts));
    }

    addCart() {
        this.carts.push({
            id: ++this.id,
            products: []
        });

        this.saveCarts();
    }

    getCarts() {
        return this.carts;
    }

    getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        return cart;
    }

    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);

        const productIndex = cart.products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            cart.products.push({ id: productId, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        this.saveCarts();
    }

    getProductsFromCart(cartId) {
        const cart = this.getCartById(cartId);
        return cart.products;
    }
}

module.exports = CartManager;