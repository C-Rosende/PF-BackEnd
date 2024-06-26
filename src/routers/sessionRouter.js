// src/routers/sessionRouter.js
const express = require('express');
const passport = require('passport');
const UserDTO = require('../dto/userDTO');
const User = require('../dao/models/user');
const bcrypt = require('bcrypt');
const sessionRouter = express.Router();

// Ruta para iniciar sesión
sessionRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

// Ruta para registrar un nuevo usuario
sessionRouter.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword,
            role: 'user'
        });
        await newUser.save();
        res.redirect('/login');
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Ruta para cerrar sesión
sessionRouter.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
        res.redirect('/login');
    });
});

// Ruta para obtener información del usuario actual
sessionRouter.get('/current', (req, res) => {
    if (req.isAuthenticated()) {
        const userDTO = new UserDTO(req.user);
        res.json(userDTO);
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

module.exports = sessionRouter;
