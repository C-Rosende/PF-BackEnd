//server.js
const express = require('express');
const ProductManager = require('./productManager');
const CartManager = require('./cartManager');

const app = express();
const port = 8080;

app.use(express.json());

const productManager = new ProductManager();
const cartManager = new CartManager();

productManager.addProduct('Big Mac', 'Una deliciosa hamburguesa con dos piezas de carne de res 100% pura, salsa especial Big Mac, lechuga, queso, pepinillos y cebolla en un pan con semillas de sésamo.', 3.99, 'big-mac.jpg', 'big-mac', 100, 'Hamburguesas');
productManager.addProduct('McNuggets', '10 piezas de pollo crujiente, dorado a la perfección y servido con tu salsa favorita.', 4.49, 'mcnuggets.jpg', 'mcnuggets', 100, 'Pollo');
productManager.addProduct('Papas Fritas', 'Papas cortadas finamente, fritas hasta obtener un dorado perfecto y sazonadas con sal.', 1.79, 'fries.jpg', 'fries', 100, 'Acompañamientos');
productManager.addProduct('Coca-Cola', 'Refresco clásico, burbujeante y refrescante, perfecto para acompañar cualquier comida.', 1.59, 'coke.jpg', 'coke', 100, 'Bebidas');
productManager.addProduct('Combo Big Mac', 'Incluye una hamburguesa Big Mac, papas fritas medianas y una bebida mediana.', 5.99, 'big-mac-combo.jpg', 'big-mac-combo', 100, 'Combos');
productManager.addProduct('Sundae de Chocolate', 'Suave helado de vainilla cubierto con una deliciosa salsa de chocolate.', 1.29, 'chocolate-sundae.jpg', 'chocolate-sundae', 100, 'Postres');
productManager.addProduct('Filete-O-Fish', 'Un filete de pescado empanizado y frito, servido con salsa tártara y una rodaja de queso en un pan suave.', 3.79, 'filet-o-fish.jpg', 'filet-o-fish', 100, 'Hamburguesas');
productManager.addProduct('Ensalada César con Pollo', 'Lechuga fresca, trozos de pollo a la parrilla, queso parmesano rallado y crutones, servidos con aderezo César.', 4.99, 'chicken-caesar-salad.jpg', 'chicken-caesar-salad', 100, 'Ensaladas');
productManager.addProduct('McFlurry Oreo', 'Helado de vainilla mezclado con trozos de galleta Oreo, una deliciosa combinación de cremoso y crujiente.', 2.39, 'oreo-mcflurry.jpg', 'oreo-mcflurry', 100, 'Postres');
productManager.addProduct('Café Iced Frappé', 'Café helado mezclado con leche y hielo, cubierto con crema batida y salsa de caramelo.', 2.99, 'iced-frappe.jpg', 'iced-frappe', 100, 'Bebidas');

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

// Rutas de carritos
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