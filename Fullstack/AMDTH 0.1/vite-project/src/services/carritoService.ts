// src/services/carritoService.ts
import { MICROSERVICES, apiRequest } from './api.config';

export interface ItemCarrito {
  id: number;
  usuarioId: number;
  productoId: number;
  productoNombre: string;
  productoPrecio: number;
  cantidad: number;
  imageUrl?: string;
}

export interface DetallesCarrito {
  usuario: any;
  items: ItemCarrito[];
  total: number;
  cantidadItems: number;
}

export const carritoService = {
  // Obtener carrito de un usuario
  async getCarrito(usuarioId: number): Promise<ItemCarrito[]> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/usuario/${usuarioId}`);
  },

  // Obtener detalles completos del carrito (usuario + items + total)
  async getDetallesCarrito(usuarioId: number): Promise<DetallesCarrito> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/usuario/${usuarioId}/detalles`);
  },

  // Agregar producto al carrito
  async agregarProducto(usuarioId: number, productoId: number, cantidad: number = 1): Promise<ItemCarrito> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/agregar`, {
      method: 'POST',
      body: JSON.stringify({
        usuarioId,
        productoId,
        cantidad
      }),
    });
  },

  // Actualizar cantidad de un item
  async actualizarCantidad(itemId: number, cantidad: number): Promise<ItemCarrito> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/item/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ cantidad }),
    });
  },

  // Eliminar item del carrito
  async eliminarItem(itemId: number): Promise<void> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/item/${itemId}`, {
      method: 'DELETE',
    });
  },

  // Vaciar carrito completo
  async vaciarCarrito(usuarioId: number): Promise<void> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/usuario/${usuarioId}`, {
      method: 'DELETE',
    });
  },

  // Calcular total del carrito
  async calcularTotal(usuarioId: number): Promise<{ total: number }> {
    return await apiRequest(`${MICROSERVICES.CARRITO}/usuario/${usuarioId}/total`);
  }
};