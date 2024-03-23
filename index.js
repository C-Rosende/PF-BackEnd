// index.js
const ProductManager = require('./productManager');

const manager = new ProductManager();
console.log(manager.getProducts());

manager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
console.log(manager.getProducts());

const product = manager.getProductById(1);
console.log(product);

manager.updateProduct(1, { price: 300 });
console.log(manager.getProductById(1));

manager.deleteProduct(1);
console.log(manager.getProducts());