//productManager.js
class ProductManager {
    constructor() {
        this.products = [];
        this.id = 0;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            console.error('All fields are required');
            return;
        }

        if (this.products.some(product => product.code === code)) {
            console.error('Product code must be unique');
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
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            console.error('Not found');
            return;
        }

        return product;
    }
}
module.exports = ProductManager;