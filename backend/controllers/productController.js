const Product = require('../models/productModel');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
};

// Obtener productos por categoría
const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ categoria: category });
    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
    res.status(500).json({ message: 'Error al obtener productos por categoría' });
  }
};

// Obtener productos por subcategoría
const getProductsBySubcategory = async (req, res) => {
  try {
    const subcategoria = decodeURIComponent(req.params.subcategory); // por si acaso
    const productos = await Product.find({ subcategoria });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos por subcategoría:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

module.exports = {
  getProducts,
  getProductsByCategory,
  getProductsBySubcategory,
};
