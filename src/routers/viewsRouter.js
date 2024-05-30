const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../dao/models/user');
const ProductManagerDB = require('../dao/productManagerDB');
const CartManagerDB = require('../dao/cartManagerDB');

class ViewsRouter extends express.Router {
    constructor() {
        super();
        const productManager = new ProductManagerDB();
        const cartManager = new CartManagerDB();

        // Ruta para mostrar el formulario de inicio de sesión
        this.get('/login', (req, res) => {
            res.render('login');
        });

        // Ruta para mostrar el formulario de registro
        this.get('/register', (req, res) => {
            res.render('register');
        });

        // Ruta para mostrar la página principal (home)
        this.get('/home', (req, res) => {
            res.render('home', { user: req.user });
        });

        // Endpoint para obtener todos los productos y renderizar la vista de productos
        this.get('/products', async (req, res) => {
            const { page } = req.query;
            let products = await productManager.getProducts();

            if (page) {
                const pageSize = 10;
                products = products.slice((page - 1) * pageSize, page * pageSize);
            }

            res.render('products', { products, user: req.user });
        });

        // Endpoint para obtener un carrito específico por su ID y renderizar la vista del carrito
        this.get('/carts/:cid', async (req, res) => {
            const cartId = req.params.cid;
            try {
                const cart = await cartManager.getCartById(cartId);
                const products = await Promise.all(cart.products.map(async product => {
                    const productData = await productManager.getProductById(product.id);
                    return { ...productData._doc, quantity: product.quantity };
                }));
                res.render('cart', { products });
            } catch (error) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            }
        });

        // Ruta para el registro
        this.post('/register', async (req, res) => {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ email, password: hashedPassword, role: 'usuario' });
            await user.save();
            res.redirect('/login');
        });

        // Ruta para procesar el inicio de sesión
        this.post('/login', (req, res, next) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) return next(err);
                if (!user) return res.redirect('/login');
                req.logIn(user, (err) => {
                    if (err) return next(err);
                    if (user.email === 'adminCoder@coder.com') {
                        return res.redirect('/products');
                    }
                    return res.redirect('/home');
                });
            })(req, res, next);
        });
    }
}

module.exports = ViewsRouter;