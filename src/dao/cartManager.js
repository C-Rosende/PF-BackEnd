//cartManager.js
const fs = require('fs');
const path = require('path');
const ProductManager = require('./productManager');

// Clase para manejar las operaciones de los carritos
class CartManager {
    constructor(io) {
        this.carts = [];
        this.id = 0;
        this.io = io;
        this.dataPath = path.join(__dirname, '..', 'data', 'carts.json');
        
        // Carga los carritos desde el archivo si existe
        if (fs.existsSync(this.dataPath)) {
            const data = fs.readFileSync(this.dataPath, 'utf-8');
            const carts = JSON.parse(data);
            this.carts = carts;
            this.id = Math.max(...this.carts.map(cart => cart.id), 0);
        }
    }

    // Guarda los carritos en el archivo
    saveCarts() {
        fs.writeFileSync(this.dataPath, JSON.stringify(this.carts));
    }

    // Agrega un nuevo carrito a la lista de carritos
    addCart() {
        this.carts.push({
            id: ++this.id,
            products: []
        });

        this.saveCarts();
        this.io.emit('cartAdded', { id: this.id });
    }

    // Devuelve la lista de carritos
    getCarts() {
        return JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
    }

    // Devuelve el carrito con el id proporcionado
    getCartById(id) {
        const cart = this.carts.find(cart => cart.id === id);

        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        return cart;
    }

    // Agrega el producto con el id proporcionado al carrito con el id proporcionado
    addProductToCart(cartId, productId, quantity = 1) {
        const cart = this.getCartById(cartId);
        const productManager = new ProductManager();
        const product = productManager.getProductById(productId);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        const productIndex = cart.products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            cart.products.push({ id: productId, quantity });
        } else {
            cart.products[productIndex].quantity += quantity;
        }

        this.saveCarts();
        this.io.emit('productAdded', { cartId, productId, quantity });
    }

    // Elimina el producto con el id proporcionado del carrito con el id proporcionado
    deleteProductFromCart(cartId, productId) {
        const cart = this.getCartById(cartId);
        const productIndex = cart.products.findIndex(product => product.id === productId);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado en el carrito');
        }

        cart.products.splice(productIndex, 1);
        this.saveCarts();
        this.io.emit('productDeleted', { cartId, productId });
    }

    // Devuelve la lista de productos en el carrito con el id proporcionado
    getProductsFromCart(cartId) {
        const cart = this.getCartById(cartId);
        return cart.products;
    }
}

module.exports = CartManager;