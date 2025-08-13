const Cart = require('../models/cartModel');

// Obtener carrito
const obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Cart.findOne({ usuario: req.usuario.id }).populate('productos.productoId');
    res.json(carrito || { productos: [] });
  } catch (err) {
    console.error("Error en obtenerCarrito:", err);
    res.status(500).json({ message: 'Error al obtener el carrito' });
  }
};

// Agregar producto al carrito
const agregarAlCarrito = async (req, res) => {
  const userId = req.usuario.id;
  const { productoId, nombre, precio, imagen } = req.body;

  try {
    let carrito = await Cart.findOne({ usuario: userId });

    if (!carrito) {
      carrito = new Cart({
        usuario: userId,
        productos: []
      });
    }

    const productoExistente = carrito.productos.find(
      item => item.productoId.toString() === productoId
    );

    if (productoExistente) {
      productoExistente.cantidad += 1;
    } else {
      carrito.productos.push({ productoId, nombre, precio, imagen, cantidad: 1 });
    }

    await carrito.save();
    res.status(200).json({ mensaje: 'Producto añadido al carrito', carrito });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ error: 'No se pudo agregar al carrito' });
  }
};

// Eliminar producto
const eliminarDelCarrito = async (req, res) => {
  const { productoId } = req.params;

  try {
    const carrito = await Cart.findOne({ usuario: req.usuario.id });

    carrito.productos = carrito.productos.filter(
      item => item.productoId.toString() !== productoId
    );

    await carrito.save();
    res.json(carrito);
  } catch (err) {
    console.error("Error en eliminarDelCarrito:", err);
    res.status(500).json({ message: 'Error al eliminar del carrito' });
  }
};

// Limpiar carrito
const limpiarCarrito = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { usuario: req.usuario.id },
      { productos: [] }
    );
    res.json({ message: 'Carrito limpiado' });
  } catch (err) {
    console.error("Error en limpiarCarrito:", err);
    res.status(500).json({ message: 'Error al limpiar el carrito' });
  }
};


const actualizarCantidadProducto = async (req, res) => {
  const userId = req.usuario.id;
  const { productoId, cantidad } = req.body;

  try {
    const cart = await Cart.findOne({ usuario: userId });
    if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

    const producto = cart.productos.find(p => p.productoId.toString() === productoId);
    if (producto) {
      producto.cantidad = cantidad;
      await cart.save();
      res.status(200).json({ message: 'Cantidad actualizada' });
    } else {
      res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar cantidad', error: err.message });
  }
};


module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  eliminarDelCarrito,
  limpiarCarrito,
  actualizarCantidadProducto
};
