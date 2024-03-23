// index.js
const ProductManager = require('./productManager');

const manager = new ProductManager();
console.log(manager.getProducts());

manager.addProduct('Big Mac', 'Dos Hamburguesas de carne 100% vacuno , Salsa Bigmac y queso derretido, un toque de cebolla, Lechuga y pepinillos.', 4290, './images/bigmac', 'Hamburguesa', 10);
console.log(manager.getProducts());

const product = manager.getProductById(1);
console.log(product);

manager.updateProduct(1, { price: 300 });
console.log(manager.getProductById(1));

manager.deleteProduct(1);
console.log(manager.getProducts());