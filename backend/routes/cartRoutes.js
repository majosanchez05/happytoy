const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  limpiarCarrito,
  actualizarCantidadProducto // ← agrega esta línea
} = require('../controllers/cartController');


// Obtener el carrito del usuario
router.get('/', authMiddleware, obtenerCarrito);

// Agregar producto
router.post('/agregar', authMiddleware, agregarAlCarrito);

// Eliminar un producto
router.delete('/eliminar/:productoId', authMiddleware, eliminarDelCarrito);

// Vaciar carrito
router.delete('/limpiar', authMiddleware, limpiarCarrito);

router.put('/actualizar', authMiddleware, actualizarCantidadProducto);


module.exports = router;
