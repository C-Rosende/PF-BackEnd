//productManager.js
const fs = require('fs');

class ProductManager {
    constructor() {
        this.products = [];
        this.id = 0;
        if (fs.existsSync('products.json')) {
            const data = fs.readFileSync('products.json', 'utf-8');
            const products = JSON.parse(data);
            this.products = products;
            this.id = this.products.length;
        }
    }

    saveProducts() {
        fs.writeFileSync('products.json', JSON.stringify(this.products));
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('Todos los campos son obligatorios');
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error('El código del producto debe ser único');
            return;
        }

        this.products.push({
            id: ++this.id,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        });

        this.saveProducts();
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        return product;
    }

    updateProduct(id, newProductData) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            throw new Error('Producto no encontrado');
        }

        delete newProductData.id;

        Object.assign(product, newProductData);

        this.saveProducts();
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            throw new Error('Producto no encontrado');
        }

        this.products.splice(productIndex, 1);

        this.saveProducts();
    }
}

module.exports = ProductManager;