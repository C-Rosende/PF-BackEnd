// productManager.js
const fs = require('fs');
const path = require('path');

// Clase para manejar las operaciones de los productos
class ProductManager {
    constructor(io) {
        this.products = [];
        this.id = 0;
        this.io = io;
        this.dataPath = path.join(__dirname, '..', '..', 'data', 'products.json');
        
        // Carga los productos desde el archivo si existe
        if (fs.existsSync(this.dataPath)) {
            const data = fs.readFileSync(this.dataPath, 'utf-8');
            const products = JSON.parse(data);
            this.products = products;
            this.id = Math.max(...this.products.map(product => product.id), 0);
        }
    }

    // Guarda los productos en el archivo
    saveProducts() {
        fs.writeFileSync(this.dataPath, JSON.stringify(this.products));
    }

    // Agrega un nuevo producto a la lista de productos
    addProduct(title, description, price, thumbnail, code, stock, category, thumbnails = []) {
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            console.error('Todos los campos son obligatorios, excepto thumbnails');
            return;
        }

        const existingProduct = this.products.find(product => product.title === title);
        if (existingProduct) {
            console.error('El producto ya existe');
            return;
        }

        this.products.push({
            id: ++this.id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status: true,
            category,
            thumbnails
        });

        this.saveProducts();
        this.io.emit('productAdded', { id: this.id, title, description, price, thumbnail, code, stock, category, thumbnails });
    }

    // Devuelve la lista de productos
    getProducts() {
        return JSON.parse(fs.readFileSync(this.dataPath, 'utf-8'));
    }

    // Devuelve el producto con el id proporcionado
    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product;
    }

    // Actualiza el producto con el id proporcionado con los nuevos datos proporcionados
    updateProduct(id, newProductData) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        delete newProductData.id;

        Object.assign(product, newProductData);

        this.saveProducts();
    }

    // Elimina el producto con el id proporcionado
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        this.products.splice(productIndex, 1);

        this.saveProducts();
        this.io.emit('productDeleted', { id });
    }
}

module.exports = ProductManager;