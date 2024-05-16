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
const session = require('express-session'); // Nueva importación
const passport = require('passport'); // Nueva importación
const LocalStrategy = require('passport-local').Strategy; // Nueva importación
const bcrypt = require('bcrypt'); // Nueva importación
const User = require('./dao/models/user'); // Ruta actualizada

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

// Configuración de la sesión
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Inicialización de Passport y sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        return done(error);
    }
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
});

// Conexión a la base de datos MongoDB en Atlas
mongoose.connect('mongodb+srv://crosendej:crosendej@cluster0.ypqdncz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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