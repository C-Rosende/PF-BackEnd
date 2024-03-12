// index.js.
const ProductManager = require('./productManager');

const manager = new ProductManager();
manager.addProduct('Big Mac', 'Dos Hamburguesas de carne 100% vacuno , Salsa Bigmac y queso derretido, un toque de cebolla, Lechuga y pepinillos.', 4290, './images/bigmac', 'Hamburguesa', 10);
console.log(manager.getProducts());
console.log(manager.getProductById(1));