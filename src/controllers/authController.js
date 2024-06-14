//authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../dao/models/user');
const { jwtSecret } = require('../../config/config');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('Usuario registrado exitosamente');
    } catch (error) {
        res.status(500).send('Error registrando usuario');
    }
};

exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send(info.message);
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).send('Inicio de sesión exitoso');
    })(req, res, next);
};

exports.logout = (req, res) => {
    res.clearCookie('jwt');
    res.status(200).send('Sesión cerrada');
};

exports.getCurrentUser = async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).send('No autorizado');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).send('No autorizado');
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(401).send('No autorizado');
    }
};