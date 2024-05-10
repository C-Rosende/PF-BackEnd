//server.js
const express = require('express');
const handlebars  = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const CartRouter = require('./routers/cartRouter');
const ProductRouter = require('./routers/productRouter');
const ProductManagerDB = require('./dao/productManagerDB');
const ViewsRouter = require('./routers/viewsRouter');

// Configuración de la aplicación Express y el servidor HTTP y Socket.IO
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 8080;

// Configuración de Handlebars como el motor de plantillas de la aplicación
const hbs = handlebars.create({ defaultLayout: false });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración del middleware de la aplicación
app.use(express.json());
app.use(express.static('public'));

// Conexión a la base de datos MongoDB en Atlas
mongoose.connect('mongodb+srv://crosendej:<password>@cluster0.ypqdncz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Define las rutas de la aplicación
app.get('/', (req, res) => {
    const productManager = new ProductManagerDB();
    const products = productManager.getProducts();
    res.render('index', { products: products });
});
app.use('/api/products', new ProductRouter(io));
app.use('/api/carts', new CartRouter(io));
app.use('/', new ViewsRouter());

// Inicia el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
