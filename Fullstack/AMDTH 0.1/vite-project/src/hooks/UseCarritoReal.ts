// src/hooks/useCarritoReal.ts
import { useState, useEffect } from 'react';
import { carritoService, type ItemCarrito } from '../services/carritoService';
import { ordenService, type ItemOrden } from '../services/ordenService';
import { authService } from '../services/authService';

export function useCarritoReal() {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const usuarioActual = authService.getCurrentUser();
  const usuarioId = usuarioActual?.id;

  useEffect(() => {
    if (usuarioId) {
      cargarCarrito();
    }
  }, [usuarioId]);

  const cargarCarrito = async () => {
    if (!usuarioId) return;

    try {
      setLoading(true);
      const items = await carritoService.getCarrito(usuarioId);
      setCarrito(items);

      const nuevoTotal = items.reduce(
        (sum, item) => sum + item.productoPrecio * item.cantidad,
        0
      );
      setTotal(nuevoTotal);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = async (producto: any) => {
    if (!usuarioId) {
      alert('Debes iniciar sesión para agregar productos');
      return;
    }

    try {
      await carritoService.agregarProducto(usuarioId, producto.id, 1);
      await cargarCarrito();
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
    }
  };

  const incrementar = async (itemId: number) => {
    const item = carrito.find(i => i.id === itemId);
    if (!item) return;

    try {
      await carritoService.actualizarCantidad(itemId, item.cantidad + 1);
      await cargarCarrito();
    } catch (error) {
      console.error('Error al incrementar:', error);
    }
  };

  const decrementar = async (itemId: number) => {
    const item = carrito.find(i => i.id === itemId);
    if (!item) return;

    try {
      if (item.cantidad <= 1) {
        await eliminarDelCarrito(itemId);
      } else {
        await carritoService.actualizarCantidad(itemId, item.cantidad - 1);
        await cargarCarrito();
      }
    } catch (error) {
      console.error('Error al decrementar:', error);
    }
  };

  const eliminarDelCarrito = async (itemId: number) => {
    try {
      await carritoService.eliminarItem(itemId);
      await cargarCarrito();
    } catch (error) {
      console.error('Error al eliminar del carrito:', error);
    }
  };

  const limpiarCarrito = async () => {
    if (!usuarioId) return;

    try {
      await carritoService.vaciarCarrito(usuarioId);
      setCarrito([]);
      setTotal(0);
    } catch (error) {
      console.error('Error al limpiar carrito:', error);
    }
  };

  const finalizarCompra = async () => {
    if (!usuarioId || carrito.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    try {
      const itemsOrden: ItemOrden[] = carrito.map(item => ({
        productoId: item.productoId,
        productoNombre: item.productoNombre,
        productoPrecio: item.productoPrecio,
        cantidad: item.cantidad,
        imageUrl: item.imageUrl
      }));

      const orden = await ordenService.crearOrden(usuarioId, total, itemsOrden);

      await limpiarCarrito();

      return orden;
    } catch (error) {
      console.error('Error al finalizar compra:', error);
      throw error;
    }
  };

  return {
    carrito,
    total,
    loading,
    agregarAlCarrito,
    incrementar,
    decrementar,
    eliminarDelCarrito,
    limpiarCarrito,
    finalizarCompra,
    cargarCarrito
  };
}
