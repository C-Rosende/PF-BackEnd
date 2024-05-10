//product.js
const mongoose = require('mongoose');

// Definimos el esquema del producto
const ProductSchema = new mongoose.Schema({
  // Cada producto tiene un título
  title: String,
  // Cada producto tiene una descripción
  description: String,
  // Cada producto tiene un precio
  price: Number,
  // Cada producto tiene una imagen en miniatura
  thumbnail: String,
  // Cada producto tiene un código
  code: String,
  // Cada producto tiene un stock
  stock: Number,
  // Cada producto tiene un estado (activo o inactivo)
  status: Boolean,
  // Cada producto pertenece a una categoría
  category: String,
  // Cada producto puede tener varias imágenes en miniatura
  thumbnails: [String]
});

// Exportamos el modelo 'Product' que usa el esquema ProductSchema
module.exports = mongoose.model('Product', ProductSchema);
