const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
  imagen: String,
  categoria: String,
  subcategoria: String
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
