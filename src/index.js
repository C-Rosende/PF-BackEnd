// index.js
const ProductManager = require('./src/managers/productManager');

const manager = new ProductManager();

// Si no hay productos, agrega algunos productos de prueba
if (manager.getProducts().length === 0) {
    for (let i = 0; i < 10; i++) {
        manager.addProduct(`Producto ${i+1}`, 'Descripción del producto', 100, 'Sin imagen', `abc${i+1}${Math.random().toString(36).substring(2, 15)}`, 10, 'Categoría', ['Imagen1', 'Imagen2']);
    }
}

// Prueba las funciones del ProductManager
console.log(manager.getProducts());

const product = manager.getProductById(1);
console.log(product);

manager.updateProduct(1, { price: 300 });
console.log(manager.getProductById(1));

manager.deleteProduct(1);
console.log(manager.getProducts());