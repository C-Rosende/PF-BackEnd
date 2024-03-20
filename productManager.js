//productManager.js
class ProductManager {
    constructor() {
        this.products = [];
        this.id = 0;
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
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            console.error('Producto no encontrado');
            return;
        }

        return product;
    }

    updateProduct(id, newProductData) {
        const product = this.products.find(product => product.id === id);

        if (!product) {
            console.error('Producto no encontrado');
            return;
        }

        delete newProductData.id;

        Object.assign(product, newProductData);
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);

        if (productIndex === -1) {
            console.error('Producto no encontrado');
            return;
        }

        this.products.splice(productIndex, 1);
    }
}

module.exports = ProductManager;