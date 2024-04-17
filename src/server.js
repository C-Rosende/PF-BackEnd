//server.js
const express = require('express');
const handlebars  = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const CartRouter = require('./routers/cartRouter');
const ProductRouter = require('./routers/productRouter');
const ProductManager = require('./managers/productManager');

// Configura la aplicación Express y el servidor HTTP y Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

// Configura Handlebars como el motor de plantillas de la aplicación
const hbs = handlebars.create({ defaultLayout: false });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configura el middleware de la aplicación
app.use(express.json());
app.use(express.static('public')); // Para servir archivos estáticos

// Define las rutas de la aplicación
app.get('/', (req, res) => {
    const productManager = new ProductManager();
    const products = productManager.getProducts();
    res.render('index', { products: products });
});
app.use('/api/products', new ProductRouter(io));
app.use('/api/carts', new CartRouter(io));

// Inicia el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
