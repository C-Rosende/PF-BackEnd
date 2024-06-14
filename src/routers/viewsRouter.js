// viewsRouter.js
const express = require('express');
const viewsRouter = express.Router();

viewsRouter.get('/login', (req, res) => {
    res.render('login');
});

viewsRouter.get('/register', (req, res) => {
    res.render('register');
});

viewsRouter.get('/home', (req, res) => {
    res.render('home');
});

module.exports = viewsRouter;