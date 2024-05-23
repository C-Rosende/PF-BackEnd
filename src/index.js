// index.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('./passportConfig');
const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

// Configuración de Express
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'my-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Mock de datos de usuario
const users = [
    { id: 1, username: 'admin', password: 'admin' }
];

// Iniciar el servidor
server.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});


// authRouter.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('./passportConfig');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    const user = req.user;
    const token = jwt.sign(user, 'secret_key');
    res.json({ token });
});

// Ruta para el registro (crear un nuevo usuario)
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({ message: 'Error al crear el usuario.' });
        } else {
            // Agregar el usuario a la base de datos
            users.push({ id: users.length + 1, username, password: hash });
            res.status(200).json({ message: 'Usuario creado exitosamente.' });
        }
    });
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
});

module.exports = router;