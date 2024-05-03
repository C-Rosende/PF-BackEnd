const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  products: [{
    id: Number,
    quantity: Number
  }]
});

module.exports = mongoose.model('Cart', CartSchema);