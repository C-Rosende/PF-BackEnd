//viewsRouter.js
const express = require('express');
const ProductManagerDB = require('../dao/productManagerDB');
const CartManagerDB = require('../dao/cartManagerDB');
const bcrypt = require('bcrypt');
const User = require('../dao/models/user');

// Clase para manejar las rutas de las vistas
class ViewsRouter extends express.Router {
    constructor() {
        super();
        // Creación de nuevas instancias de ProductManagerDB y CartManagerDB
        const productManager = new ProductManagerDB();
        const cartManager = new CartManagerDB();

        // Endpoint para obtener todos los productos y renderizar la vista de productos
        this.get('/products', async (req, res) => {
            const { page } = req.query;
            let products = await productManager.getProducts();

            // Paginar productos si se proporciona un parámetro de página
            if (page) {
                const pageSize = 10;
                products = products.slice((page - 1) * pageSize, page * pageSize);
            }

            // Renderizar la vista de productos con la lista de productos
            res.render('products', { products, user: req.user });
        });

        // Endpoint para obtener un carrito específico por su ID y renderizar la vista del carrito
        this.get('/carts/:cid', async (req, res) => {
            const cartId = req.params.cid;
            try {
                const cart = await cartManager.getCartById(cartId);
                // Obtener los datos de los productos en el carrito
                const products = await Promise.all(cart.products.map(async product => {
                    const productData = await productManager.getProductById(product.id);
                    // Devolver los datos del producto junto con la cantidad en el carrito
                    return { ...productData._doc, quantity: product.quantity };
                }));
                // Renderizar la vista del carrito con la lista de productos
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

        // Ruta para el inicio de sesión
        this.post('/login', async (req, res, next) => {
            const { email, password } = req.body;
            if (email === 'adminCoder@coder.com' && password === 'CoderCoder') {
                // Iniciar sesión como administrador
                const user = { email, role: 'admin' };
                req.login(user, (err) => {
                    if (err) return next(err);
                    return res.redirect('/products');
                });
            } else {
                // Iniciar sesión como usuario
                passport.authenticate('local', {
                    successRedirect: '/products',
                    failureRedirect: '/login',
                })(req, res, next);
            }
        });
    }
}

module.exports = ViewsRouter;