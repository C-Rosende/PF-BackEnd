// cart.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define el esquema del carrito
const CartSchema = new Schema({
    // El carrito tiene un array de productos
    products: [{
        // Cada producto tiene un id que es una referencia al modelo 'Product'
        id: { type: Schema.Types.ObjectId, ref: 'Product' },
        // Cada producto tiene una cantidad
        quantity: Number
    }]
});

// Exporta el modelo 'Cart' que usa el esquema CartSchema
module.exports = mongoose.model('Cart', CartSchema);