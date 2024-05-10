//productManagerDB.js
const Product = require('./models/Product');

class ProductManagerDB {
  // Obtiene todos los productos de la base de datos
  async getProducts() {
    return await Product.find();
  }

  // Obtiene un producto específico por su ID
  async getProductById(id) {
    return await Product.findById(id);
  }

  // Agrega un nuevo producto a la base de datos
  async addProduct(productData) {
    const product = new Product(productData);
    await product.save();
  }

  // Actualiza un producto existente en la base de datos
  async updateProduct(id, newProductData) {
    await Product.findByIdAndUpdate(id, newProductData);
  }

  // Elimina un producto de la base de datos
  async deleteProduct(id) {
    await Product.findByIdAndDelete(id);
  }
}

module.exports = ProductManagerDB;