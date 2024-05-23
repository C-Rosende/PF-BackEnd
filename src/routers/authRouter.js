// authRouter.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

// Mock de datos de usuario
const users = [];

// Ruta para el inicio de sesión
router.post('/login', (req, res) => {
    const user = { id: 1, username: 'admin' };
    const token = jwt.sign(user, 'secret_key');
    res.json({ token });
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
            users.push({ id: users.length + 1, username, password: hash });
            res.status(200).json({ message: 'Usuario registrado exitosamente.' });
        }
    });
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    res.status(200).json({ message: 'Sesión cerrada exitosamente.' });
});

module.exports = router;