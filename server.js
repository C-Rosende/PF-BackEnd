//server.js
const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./cartManager');

const app = express();
const port = 8080;

app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();

app.get('/', (req, res) => {
    res.send(`
        <h1>¡Bienvenido a mi página!</h1>
        <button onclick="location.href='/api/products'" type="button">Ver productos</button>
    `);
});

app.get('/api/products', (req, res) => {
    const limit = req.query.limit;
    if (limit) {
        res.json(productManager.getProducts().slice(0, limit));
    } else {
        res.json(productManager.getProducts());
    }
});

app.get('/api/products/:pid', (req, res) => {
    const id = Number(req.params.pid);
    try {
        const product = productManager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.post('/api/products', (req, res) => {
    const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
    productManager.addProduct(title, description, price, thumbnail, code, stock, category, thumbnails);
    res.status(201).json({ message: 'Producto agregado exitosamente' });
});

app.put('/api/products/:pid', (req, res) => {
    const id = Number(req.params.pid);
    const newProductData = req.body;
    try {
        productManager.updateProduct(id, newProductData);
        res.json({ message: 'Producto actualizado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.delete('/api/products/:pid', (req, res) => {
    const id = Number(req.params.pid);
    try {
        productManager.deleteProduct(id);
        res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.post('/api/carts', (req, res) => {
    cartManager.addCart();
    res.status(201).json({ message: 'Carrito creado exitosamente' });
});

app.get('/api/carts/:cid', (req, res) => {
    const id = Number(req.params.cid);
    try {
        const cart = cartManager.getCartById(id);
        res.json(cart);
    } catch (error) {
        res.status(404).json({ error: 'Carrito no encontrado' });
    }
});

app.post('/api/carts/:cid/products/:pid', (req, res) => {
    const cartId = Number(req.params.cid);
    const productId = Number(req.params.pid);
    try {
        cartManager.addProductToCart(cartId, productId);
        res.json({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        res.status(404).json({ error: 'Carrito o producto no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});