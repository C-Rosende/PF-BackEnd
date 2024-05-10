// productRouter.js
const express = require('express');
const ProductManagerDB = require('../dao/productManagerDB');

// Clase para manejar las rutas de los productos
class ProductRouter extends express.Router {
    constructor(io) {
        super();
        // Creación de una nueva instancia de ProductManagerDB
        const productManager = new ProductManagerDB(io);

        // Endpoint para obtener todos los productos
        this.get('/', async (req, res) => {
            const { limit, page, sort, query } = req.query;
            let products = await productManager.getProducts();

            // Filtrar productos por título si se proporciona un parámetro de consulta
            if (query) {
                products = products.filter(product => product.title.includes(query));
            }

            // Ordenar productos si se proporciona un parámetro de ordenamiento
            if (sort) {
                products.sort((a, b) => a[sort] > b[sort] ? 1 : -1);
            }

            // Paginar productos si se proporcionan parámetros de página y límite
            if (page) {
                const pageSize = limit || 10;
                products = products.slice((page - 1) * pageSize, page * pageSize);
            } else if (limit) {
                products = products.slice(0, limit);
            }

            res.json(products);
        });

        // Endpoint para obtener un producto específico por su ID
        this.get('/:pid', async (req, res) => {
            const id = Number(req.params.pid);
            try {
                const product = await productManager.getProductById(id);
                res.json(product);
            } catch (error) {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });

        // Endpoint para agregar un nuevo producto
        this.post('/', async (req, res) => {
            const { title, description, price, thumbnail, code, stock, category, thumbnails } = req.body;
            await productManager.addProduct(title, description, price, thumbnail, code, stock, category, thumbnails);
            res.status(201).json({ message: 'Producto agregado exitosamente' });
        });

        // Endpoint para actualizar un producto existente
        this.put('/:pid', async (req, res) => {
            const id = Number(req.params.pid);
            const newProductData = req.body;
            try {
                await productManager.updateProduct(id, newProductData);
                res.json({ message: 'Producto actualizado exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });

        // Endpoint para eliminar un producto existente
        this.delete('/:pid', async (req, res) => {
            const id = Number(req.params.pid);
            try {
                await productManager.deleteProduct(id);
                res.json({ message: 'Producto eliminado exitosamente' });
            } catch (error) {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        });
    }
}

module.exports = ProductRouter;