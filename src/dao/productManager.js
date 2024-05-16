//productManager.js
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
        // Verifica que todos los campos obligatorios estén presentes
        if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
            console.error('Todos los campos son obligatorios, excepto thumbnails');
            return;
        }

        // Verifica si el producto ya existe
        const existingProduct = this.products.find(product => product.title === title);
        if (existingProduct) {
            console.error('El producto ya existe');
            return;
        }

        // Agrega el nuevo producto a la lista de productos
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

        // Guarda los productos en el archivo
        this.saveProducts();
        // Emite un evento de 'productAdded' con los detalles del producto
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

        // Elimina el id de los nuevos datos del producto
        delete newProductData.id;

        // Combina los nuevos datos del producto con los existentes
        Object.assign(product, newProductData);

        // Guarda los productos en el archivo
        this.saveProducts();
    }

    // Elimina el producto con el id proporcionado
    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        // Elimina el producto de la lista de productos
        this.products.splice(productIndex, 1);

        // Guarda los productos en el archivo
        this.saveProducts();
        // Emite un evento de 'productDeleted' con el id del producto
        this.io.emit('productDeleted', { id });
    }
}

module.exports = ProductManager;