// authRouter.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Ruta para el inicio de sesión
router.post('/login', (req, res) => {
    const user = { id: 1, username: 'admin' };
    const token = jwt.sign(user, 'secret_key');
    res.json({ token });
});

// Ruta para el registro (crear un nuevo usuario)
router.post('/register', (req, res) => {
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
});

module.exports = router;