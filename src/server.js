//server.js
const express = require('express');
const productRouter = require('./routers/productRouter');
const cartRouter = require('./routers/cartRouter');

const app = express();
const port = 8080;

app.use(express.json());

// Ruta principal que da la bienvenida al usuario
app.get('/', (req, res) => {
    res.send(`
        <h1>¡Bienvenido a mi página!</h1>
        <button onclick="location.href='/api/products'" type="button">Ver productos</button>
    `);
});

// Rutas para los productos y los carritos
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});