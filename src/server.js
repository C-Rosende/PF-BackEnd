// server.js
const express = require('express');
const handlebars = require('express-handlebars');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./dao/models/user');
const sessionRouter = require('./routers/sessionRouter');

// Creación de la aplicación Express y el servidor HTTP
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 8080;

// Configuración de Handlebars
const hbs = handlebars.create({ defaultLayout: false });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Configuración del middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use('/styles.css', express.static(path.join(__dirname, 'styles.css')));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Configuración de Passport para la autenticación local
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

// Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://crosendej:crosendej@cluster0.ypqdncz.mongodb.net/?retryWrites=true&w=majority')
    .then(() => {
        console.log('Conectado a MongoDB Atlas');

        // Crear el usuario administrador por defecto si no existe
        User.findOne({ email: 'adminCoder@coder.com' }).then(async (user) => {
            if (!user) {
                const hashedPassword = await bcrypt.hash('CoderCoder', 10);
                const adminUser = new User({
                    email: 'adminCoder@coder.com',
                    password: hashedPassword,
                    role: 'admin'
                });
                await adminUser.save();
                console.log('Usuario administrador creado');
            }
        }).catch(err => console.error('Error al buscar el usuario administrador:', err));
    })
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

// Configuración de las rutas
app.get('/', (req, res) => {
    res.redirect('/login');
});

// Importar las clases de enrutadores
const ProductRouter = require('./routers/productRouter');
const CartRouter = require('./routers/cartRouter');
const ViewsRouter = require('./routers/viewsRouter');

// Uso de los enrutadores
app.use('/api/products', new ProductRouter(io));
app.use('/api/carts', new CartRouter(io));
app.use('/', new ViewsRouter());
app.use('/session', sessionRouter);

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});