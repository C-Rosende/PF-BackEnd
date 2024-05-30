const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('./passportConfig');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT || 3000;

// Configuración de Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'my-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('../src/routers/authRouter');
const viewsRouter = require('../src/routers/viewsRouter');
app.use('/', viewsRouter);
app.use('/auth', authRouter);

// Configurar vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});