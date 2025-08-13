const express = require("express");
const router = express.Router();

// ✅ Importación corregida: nombre correcto del archivo
const { 
    getProducts, 
    getProductsByCategory, 
    getProductsBySubcategory 
} = require("../controllers/productController");

// Obtener todos los productos
router.get("/", getProducts);

// Obtener productos por categoría
router.get("/categoria/:category", getProductsByCategory);

// Obtener productos por subcategoría
router.get("/subcategoria/:subcategory", getProductsBySubcategory);

module.exports = router;
