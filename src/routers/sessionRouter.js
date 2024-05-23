// sessionRouter.js
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../dao/models/user');

const router = express.Router();

// Ruta de registro
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        res.status(500).send('Error registrando usuario');
    }
});

// Ruta de inicio de sesión
router.post('/login', passport.authenticate('local', {
    successRedirect: '/products',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ruta de cierre de sesión
router.post('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.send('Sesión cerrada');
    });
});

module.exports = router;