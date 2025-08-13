const API_URL = "https://happytoys-backend.onrender.com";
const ENVIO_COSTO = 10000;

function openCartModal() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.style.display = 'block';
    cargarCarrito('contenedor-carrito');
  }
}

function closeModal() {
  const modal = document.getElementById('cartModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

window.addEventListener('click', (event) => {
  const modal = document.getElementById('cartModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

async function cargarCarrito(contenedorId) {
  const token = localStorage.getItem('token');
  if (!token) {
    if (contenedorId === 'cartItems') {
      window.location.href = 'login.html';
    }
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Error al obtener el carrito');
    const data = await res.json();
    renderizarCarritoEnContenedor(data, contenedorId);
    actualizarContadorCarrito();
  } catch (err) {
    console.error("Error al cargar carrito:", err);
    document.getElementById(contenedorId).innerHTML = '<p>Error al cargar el carrito.</p>';
  }
}

function renderizarCarritoEnContenedor(carrito, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) {
    console.warn(`⚠️ El contenedor con ID "${contenedorId}" no existe en el DOM.`);
    return;
  }

  contenedor.innerHTML = '';

  if (!carrito.productos || carrito.productos.length === 0) {
    contenedor.innerHTML = '<p>No hay productos en el carrito.</p>';
    actualizarTotales(0);
    return;
  }

  let subtotal = 0;
  carrito.productos.forEach(p => {
    const item = document.createElement('div');
    item.classList.add('cart-item');
    const cantidad = p.cantidad || 1;
    subtotal += p.precio * cantidad;

    item.innerHTML = `
      <img src="${p.imagen}" alt="${p.nombre}" width="80">
      <div>
        <h3>${p.nombre}</h3>
        <p>Precio: $${p.precio.toLocaleString('es-CO')} COP</p>
        <p>
          Cantidad:
          <button class="decrease" data-id="${p.productoId._id}" data-cantidad="${cantidad}">-</button>
          <span>${cantidad}</span>
          <button class="increase" data-id="${p.productoId._id}" data-cantidad="${cantidad}">+</button>
        </p>
       <button onclick="eliminarDelCarrito('${p.productoId._id}', '${contenedorId}')">Eliminar</button>
      </div>
    `;
    contenedor.appendChild(item);
  });

  actualizarTotales(subtotal);

  contenedor.querySelectorAll('.increase').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const current = parseInt(btn.parentElement.querySelector('span').textContent) || 1;
      await actualizarCantidadProducto(id, current + 1, contenedorId);
    });
  });
  
  contenedor.querySelectorAll('.decrease').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const current = parseInt(btn.parentElement.querySelector('span').textContent) || 1;
      if (current > 1) {
        await actualizarCantidadProducto(id, current - 1, contenedorId);
      }
    });
  });
}

function actualizarTotales(subtotal) {
  const envio = ENVIO_COSTO;
  const total = subtotal + envio;

  if (document.getElementById('subtotal')) {
    document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString('es-CO')} COP`;
  }
  if (document.getElementById('shipping-cost')) {
    document.getElementById('shipping-cost').textContent = `$${envio.toLocaleString('es-CO')} COP`;
  }
  if (document.getElementById('total')) {
    document.getElementById('total').textContent = `$${total.toLocaleString('es-CO')} COP`;
  }
}

async function eliminarDelCarrito(productoId, contenedorId = 'cartItems') {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${API_URL}/api/cart/eliminar/${productoId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      cargarCarrito(contenedorId);
    }
  } catch (err) {
    console.error('Error al eliminar producto', err);
  }
}

async function addToCart(productoId, nombre, precio, imagen) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/cart/agregar`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ productoId, nombre, precio, imagen })
    });

    if (!response.ok) {
      throw new Error('Error al agregar al carrito');
    }

    alert("Producto añadido al carrito");
    actualizarContadorCarrito();
  } catch (error) {
    console.error('Error:', error);
    alert("Hubo un problema al agregar el producto al carrito.");
  }
}

async function actualizarContadorCarrito() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const data = await response.json();
    const totalItems = Array.isArray(data.productos)
      ? data.productos.reduce((sum, item) => sum + (item.cantidad || 1), 0)
      : 0;
    document.getElementById("cart-count").textContent = totalItems;
  } catch (error) {
    console.error("Error al actualizar contador del carrito:", error);
  }
}

async function checkout() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para continuar con la compra');
    window.location.href = 'login.html';
    return;
  }

  alert('Gracias por tu compra 🥳 (Aquí iría el flujo de pago)');

  try {
    await fetch(`${API_URL}/api/cart/limpiar`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    await cargarCarrito('cartItems');
    actualizarContadorCarrito();
  } catch (err) {
    console.error("Error al vaciar carrito después de la compra:", err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  actualizarContadorCarrito();
});

async function actualizarCantidadProducto(productoId, cantidad, contenedorId) {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${API_URL}/api/cart/actualizar`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productoId, cantidad })
    });

    if (!res.ok) throw new Error('Error al actualizar la cantidad');
    await cargarCarrito(contenedorId);
  } catch (err) {
    console.error("Error al actualizar cantidad:", err);
  }
}
