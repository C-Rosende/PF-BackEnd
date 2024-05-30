// authRouter.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

// Mock de datos de usuario
const users = [
    { id: 1, username: 'admin', password: 'admin' }
];

// Ruta para el inicio de sesión
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user.id, username: user.username }, 'secret_key');
    res.redirect('/home');
});

// Ruta para el registro
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Verificar si el usuario ya existe
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    // Hashear la contraseña antes de almacenarla
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({ message: 'Error al hashear la contraseña.' });
        } else {
            // Agregar el usuario a la base de datos (o al array de usuarios en este caso)
            users.push({ id: users.length + 1, username, password: hash });
            res.status(200).json({ message: 'Usuario registrado exitosamente.' });
        }
    });
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
});

// Ruta para autenticación con GitHub
router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        res.redirect('/home');
    }
);

module.exports = router;