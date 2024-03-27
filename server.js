const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const port = 8080;

const manager = new ProductManager();

for (let i = 0; i < 10; i++) {
    manager.addProduct(`Producto ${i+1}`, 'Descripción del producto', 100, 'Sin imagen', `abc${i+1}`, 10);
}

app.get('/products', (req, res) => {
    const limit = req.query.limit;
    if (limit) {
        res.json(manager.getProducts().slice(0, limit));
    } else {
        res.json(manager.getProducts());
    }
});

app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);
    try {
        const product = manager.getProductById(id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
