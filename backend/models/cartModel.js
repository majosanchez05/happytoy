const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  nombre: String,
  precio: Number,
  imagen: String,
  cantidad: {
    type: Number,
    default: 1
  }
});

const cartSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  productos: [cartItemSchema]
});

module.exports = mongoose.model('Cart', cartSchema);
