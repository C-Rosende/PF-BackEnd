// sessionRouter.js
const express = require('express');
const passport = require('passport');
const sessionRouter = express.Router();

sessionRouter.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

sessionRouter.post('/register', async (req, res) => {
    // Implementa lógica de registro aquí
});

sessionRouter.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

module.exports = sessionRouter;