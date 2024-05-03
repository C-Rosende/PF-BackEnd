const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: String,
  stock: Number,
  status: Boolean,
  category: String,
  thumbnails: [String]
});

module.exports = mongoose.model('Product', ProductSchema);